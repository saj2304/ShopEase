package com.shopease.service.impl;

import com.shopease.dto.request.ProductRequest;
import com.shopease.dto.response.*;
import com.shopease.entity.*;
import com.shopease.exception.*;
import com.shopease.repository.*;
import com.shopease.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public ProductResponse createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        Product product = Product.builder()
                .name(request.getName()).description(request.getDescription())
                .price(request.getPrice()).discountPrice(request.getDiscountPrice())
                .stock(request.getStock()).imageUrl(request.getImageUrl())
                .active(true).category(category).build();
        return toResponse(productRepository.save(product));
    }

    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        product.setName(request.getName()); product.setDescription(request.getDescription());
        product.setPrice(request.getPrice()); product.setDiscountPrice(request.getDiscountPrice());
        product.setStock(request.getStock()); product.setImageUrl(request.getImageUrl());
        product.setCategory(category);
        return toResponse(productRepository.save(product));
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        product.setActive(false);
        productRepository.save(product);
    }

    @Override
    public ProductResponse getProduct(Long id) {
        return toResponse(productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found")));
    }

    @Override
    public PageResponse<ProductResponse> getAllProducts(int page, int size) {
        Page<Product> products = productRepository.findByActiveTrue(PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return toPageResponse(products);
    }

    @Override
    public PageResponse<ProductResponse> getProductsByCategory(Long categoryId, int page, int size) {
        Page<Product> products = productRepository.findByCategoryIdAndActiveTrue(categoryId, PageRequest.of(page, size));
        return toPageResponse(products);
    }

    @Override
    public PageResponse<ProductResponse> searchProducts(String keyword, int page, int size) {
        Page<Product> products = productRepository.searchProducts(keyword, PageRequest.of(page, size));
        return toPageResponse(products);
    }

    private ProductResponse toResponse(Product p) {
        return ProductResponse.builder()
                .id(p.getId()).name(p.getName()).description(p.getDescription())
                .price(p.getPrice()).discountPrice(p.getDiscountPrice())
                .stock(p.getStock()).imageUrl(p.getImageUrl()).active(p.getActive())
                .categoryName(p.getCategory().getName()).categoryId(p.getCategory().getId())
                .createdAt(p.getCreatedAt()).build();
    }

    private PageResponse<ProductResponse> toPageResponse(Page<Product> page) {
        return PageResponse.<ProductResponse>builder()
                .content(page.getContent().stream().map(this::toResponse).collect(Collectors.toList()))
                .pageNumber(page.getNumber()).pageSize(page.getSize())
                .totalElements(page.getTotalElements()).totalPages(page.getTotalPages())
                .last(page.isLast()).build();
    }
}
