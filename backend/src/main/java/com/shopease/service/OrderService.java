package com.shopease.service;

import com.shopease.dto.request.OrderRequest;
import com.shopease.dto.request.PaymentVerifyRequest;
import com.shopease.dto.response.OrderResponse;
import com.shopease.dto.response.PageResponse;
import java.util.Map;

public interface OrderService {
    Map<String, Object> createOrder(OrderRequest request, String userEmail);
    void verifyPayment(PaymentVerifyRequest request);
    PageResponse<OrderResponse> getUserOrders(String userEmail, int page, int size);
    PageResponse<OrderResponse> getAllOrders(int page, int size);
    OrderResponse getOrder(Long id);
    OrderResponse updateOrderStatus(Long id, String status);
}
