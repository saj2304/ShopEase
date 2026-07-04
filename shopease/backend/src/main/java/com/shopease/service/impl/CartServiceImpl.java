package com.shopease.service.impl;

import com.shopease.entity.Product;
import com.shopease.exception.BadRequestException;
import com.shopease.exception.ResourceNotFoundException;
import com.shopease.repository.ProductRepository;
import com.shopease.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ProductRepository productRepository;

    private String cartKey(String email) { return "cart:" + email; }

    @Override
    public void addToCart(String email, Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        if (product.getStock() < quantity)
            throw new BadRequestException("Insufficient stock. Available: " + product.getStock());

        String key = cartKey(email);
        Map<Object, Object> cart = redisTemplate.opsForHash().entries(key);
        int current = cart.containsKey(productId.toString())
                ? (int) cart.get(productId.toString()) : 0;
        redisTemplate.opsForHash().put(key, productId.toString(), current + quantity);
    }

    @Override
    public void removeFromCart(String email, Long productId) {
        redisTemplate.opsForHash().delete(cartKey(email), productId.toString());
    }

    @Override
    public void updateCartQuantity(String email, Long productId, Integer quantity) {
        if (quantity <= 0) { removeFromCart(email, productId); return; }
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        if (product.getStock() < quantity)
            throw new BadRequestException("Insufficient stock");
        redisTemplate.opsForHash().put(cartKey(email), productId.toString(), quantity);
    }

    @Override
    public Map<String, Object> getCart(String email) {
        Map<Object, Object> cartData = redisTemplate.opsForHash().entries(cartKey(email));
        List<Map<String, Object>> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (Map.Entry<Object, Object> entry : cartData.entrySet()) {
            Long productId = Long.parseLong(entry.getKey().toString());
            int qty = Integer.parseInt(entry.getValue().toString());
            productRepository.findById(productId).ifPresent(product -> {
                BigDecimal effectivePrice = product.getDiscountPrice() != null
                        ? product.getDiscountPrice() : product.getPrice();
                Map<String, Object> item = new HashMap<>();
                item.put("productId", product.getId());
                item.put("name", product.getName());
                item.put("imageUrl", product.getImageUrl());
                item.put("price", effectivePrice);
                item.put("quantity", qty);
                item.put("subtotal", effectivePrice.multiply(BigDecimal.valueOf(qty)));
                items.add(item);
            });
        }
        BigDecimal grandTotal = items.stream()
                .map(i -> (BigDecimal) i.get("subtotal"))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> result = new HashMap<>();
        result.put("items", items);
        result.put("total", grandTotal);
        result.put("itemCount", items.size());
        return result;
    }

    @Override
    public void clearCart(String email) {
        redisTemplate.delete(cartKey(email));
    }
}
