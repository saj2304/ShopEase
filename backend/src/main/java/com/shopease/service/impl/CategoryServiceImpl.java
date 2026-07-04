package com.shopease.service.impl;

import com.shopease.dto.request.CategoryRequest;
import com.shopease.dto.response.CategoryResponse;
import com.shopease.entity.Category;
import com.shopease.exception.*;
import com.shopease.repository.CategoryRepository;
import com.shopease.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName()))
            throw new BadRequestException("Category already exists: " + request.getName());
        Category cat = Category.builder()
                .name(request.getName()).description(request.getDescription()).build();
        return toResponse(categoryRepository.save(cat));
    }

    @Override
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category cat = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        cat.setName(request.getName());
        cat.setDescription(request.getDescription());
        return toResponse(categoryRepository.save(cat));
    }

    @Override
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id))
            throw new ResourceNotFoundException("Category not found");
        categoryRepository.deleteById(id);
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public CategoryResponse getCategory(Long id) {
        return toResponse(categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found")));
    }

    private CategoryResponse toResponse(Category cat) {
        return CategoryResponse.builder()
                .id(cat.getId()).name(cat.getName()).description(cat.getDescription())
                .productCount(cat.getProducts() != null ? cat.getProducts().size() : 0)
                .build();
    }
}
