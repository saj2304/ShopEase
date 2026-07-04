package com.shopease.dto.response;

import lombok.*;
import java.util.List;

@Data @Builder
public class PageResponse<T> {
    private List<T> content;
    private int pageNumber;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean last;
}
