package com.shopease.service;

import com.shopease.dto.request.ProductRequest;
import com.shopease.dto.response.PageResponse;
import com.shopease.dto.response.ProductResponse;

public interface ProductService {
    ProductResponse createProduct(ProductRequest request);
    ProductResponse updateProduct(Long id, ProductRequest request);
    void deleteProduct(Long id);
    ProductResponse getProduct(Long id);
    PageResponse<ProductResponse> getAllProducts(int page, int size);
    PageResponse<ProductResponse> getProductsByCategory(Long categoryId, int page, int size);
    PageResponse<ProductResponse> searchProducts(String keyword, int page, int size);
}
