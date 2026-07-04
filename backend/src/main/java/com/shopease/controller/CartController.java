package com.shopease.controller;

import com.shopease.dto.response.ApiResponse;
import com.shopease.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "Shopping cart (Redis-backed)")
@SecurityRequirement(name = "Bearer Auth")
public class CartController {

    private final CartService cartService;

    @GetMapping
    @Operation(summary = "Get current user's cart")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCart(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Cart fetched",
                cartService.getCart(userDetails.getUsername())));
    }

    @PostMapping("/add")
    @Operation(summary = "Add item to cart")
    public ResponseEntity<ApiResponse<String>> addToCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") Integer quantity) {
        cartService.addToCart(userDetails.getUsername(), productId, quantity);
        return ResponseEntity.ok(ApiResponse.success("Added to cart", "OK"));
    }

    @PutMapping("/update")
    @Operation(summary = "Update item quantity in cart")
    public ResponseEntity<ApiResponse<String>> updateCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {
        cartService.updateCartQuantity(userDetails.getUsername(), productId, quantity);
        return ResponseEntity.ok(ApiResponse.success("Cart updated", "OK"));
    }

    @DeleteMapping("/remove/{productId}")
    @Operation(summary = "Remove item from cart")
    public ResponseEntity<ApiResponse<String>> removeFromCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long productId) {
        cartService.removeFromCart(userDetails.getUsername(), productId);
        return ResponseEntity.ok(ApiResponse.success("Removed from cart", "OK"));
    }

    @DeleteMapping("/clear")
    @Operation(summary = "Clear entire cart")
    public ResponseEntity<ApiResponse<String>> clearCart(
            @AuthenticationPrincipal UserDetails userDetails) {
        cartService.clearCart(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", "OK"));
    }
}
