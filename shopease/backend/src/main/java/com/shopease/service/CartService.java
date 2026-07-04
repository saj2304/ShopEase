package com.shopease.service;

import java.util.Map;

public interface CartService {
    void addToCart(String userEmail, Long productId, Integer quantity);
    void removeFromCart(String userEmail, Long productId);
    void updateCartQuantity(String userEmail, Long productId, Integer quantity);
    Map<String, Object> getCart(String userEmail);
    void clearCart(String userEmail);
}
