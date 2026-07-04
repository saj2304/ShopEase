package com.shopease.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private Integer stock;
    private String imageUrl;
    private Boolean active;
    private String categoryName;
    private Long categoryId;
    private LocalDateTime createdAt;
}
