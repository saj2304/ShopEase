package com.shopease.service.impl;

import com.razorpay.*;
import com.shopease.dto.request.OrderRequest;
import com.shopease.dto.request.PaymentVerifyRequest;
import com.shopease.dto.response.*;
import com.shopease.entity.*;
import com.shopease.entity.Order;
import com.shopease.enums.*;
import com.shopease.exception.*;
import com.shopease.repository.*;
import com.shopease.service.CartService;
import com.shopease.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;

    @Value("${app.razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${app.razorpay.key.secret}")
    private String razorpayKeySecret;

    @Override
    @Transactional
    public Map<String, Object> createOrder(OrderRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemReq.getProductId()));
            if (product.getStock() < itemReq.getQuantity())
                throw new BadRequestException("Insufficient stock for: " + product.getName());

            BigDecimal price = product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice();
            BigDecimal itemTotal = price.multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            total = total.add(itemTotal);

            product.setStock(product.getStock() - itemReq.getQuantity());
            productRepository.save(product);

            orderItems.add(OrderItem.builder()
                    .product(product).quantity(itemReq.getQuantity())
                    .unitPrice(price).totalPrice(itemTotal).build());
        }

        Order order = Order.builder()
                .user(user).items(orderItems).totalAmount(total)
                .shippingAddress(request.getShippingAddress()).build();
        orderItems.forEach(item -> item.setOrder(order));
        Order savedOrder = orderRepository.save(order);

        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            JSONObject options = new JSONObject();
            options.put("amount", total.multiply(BigDecimal.valueOf(100)).intValue());
            options.put("currency", "INR");
            options.put("receipt", "order_" + savedOrder.getId());
            com.razorpay.Order rzpOrder = razorpay.orders.create(options);

            savedOrder.setRazorpayOrderId(rzpOrder.get("id").toString());
            orderRepository.save(savedOrder);

            cartService.clearCart(userEmail);

            Map<String, Object> result = new HashMap<>();
            result.put("orderId", savedOrder.getId());
            result.put("razorpayOrderId", rzpOrder.get("id").toString());
            result.put("amount", total.multiply(BigDecimal.valueOf(100)).intValue());
            result.put("currency", "INR");
            result.put("keyId", razorpayKeyId);
            return result;
        } catch (RazorpayException e) {
            throw new BadRequestException("Payment gateway error: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void verifyPayment(PaymentVerifyRequest request) {
        try {
            String data = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();
            Mac sha256Hmac = Mac.getInstance("HmacSHA256");
            sha256Hmac.init(new SecretKeySpec(razorpayKeySecret.getBytes(), "HmacSHA256"));
            byte[] hash = sha256Hmac.doFinal(data.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) hexString.append(String.format("%02x", b));

            if (!hexString.toString().equals(request.getRazorpaySignature()))
                throw new BadRequestException("Payment verification failed — invalid signature");

            Order order = orderRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
            order.setPaymentStatus(PaymentStatus.SUCCESS);
            order.setStatus(OrderStatus.PAID);
            order.setRazorpayPaymentId(request.getRazorpayPaymentId());
            orderRepository.save(order);
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new BadRequestException("Payment verification error: " + e.getMessage());
        }
    }

    @Override
    public PageResponse<OrderResponse> getUserOrders(String userEmail, int page, int size) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Page<Order> orders = orderRepository.findByUserId(user.getId(), PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return toPageResponse(orders);
    }

    @Override
    public PageResponse<OrderResponse> getAllOrders(int page, int size) {
        Page<Order> orders = orderRepository.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return toPageResponse(orders);
    }

    @Override
    public OrderResponse getOrder(Long id) {
        return toResponse(orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found")));
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus(OrderStatus.valueOf(status.toUpperCase()));
        return toResponse(orderRepository.save(order));
    }

    private OrderResponse toResponse(com.shopease.entity.Order order) {
        List<OrderResponse.OrderItemResponse> items = order.getItems().stream()
                .map(i -> OrderResponse.OrderItemResponse.builder()
                        .productId(i.getProduct().getId())
                        .productName(i.getProduct().getName())
                        .imageUrl(i.getProduct().getImageUrl())
                        .quantity(i.getQuantity())
                        .unitPrice(i.getUnitPrice())
                        .totalPrice(i.getTotalPrice()).build())
                .collect(Collectors.toList());
        return OrderResponse.builder()
                .id(order.getId())
                .customerName(order.getUser().getName())
                .customerEmail(order.getUser().getEmail())
                .items(items).totalAmount(order.getTotalAmount())
                .status(order.getStatus().name())
                .paymentStatus(order.getPaymentStatus().name())
                .razorpayOrderId(order.getRazorpayOrderId())
                .shippingAddress(order.getShippingAddress())
                .createdAt(order.getCreatedAt()).build();
    }

    private PageResponse<OrderResponse> toPageResponse(Page<com.shopease.entity.Order> page) {
        return PageResponse.<OrderResponse>builder()
                .content(page.getContent().stream().map(this::toResponse).collect(Collectors.toList()))
                .pageNumber(page.getNumber()).pageSize(page.getSize())
                .totalElements(page.getTotalElements()).totalPages(page.getTotalPages())
                .last(page.isLast()).build();
    }
}
