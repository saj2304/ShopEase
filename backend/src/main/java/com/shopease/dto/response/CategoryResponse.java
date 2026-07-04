package com.shopease.dto.response;

import lombok.*;

@Data @Builder
public class CategoryResponse {
    private Long id;
    private String name;
    private String description;
    private Integer productCount;
}
