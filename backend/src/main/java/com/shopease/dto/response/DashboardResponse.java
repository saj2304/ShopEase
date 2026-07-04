package com.shopease.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data @Builder
public class DashboardResponse {
    private Long totalOrders;
    private Long pendingOrders;
    private Long deliveredOrders;
    private BigDecimal totalRevenue;
    private Long totalProducts;
    private Long totalUsers;
    private List<OrderResponse> recentOrders;
}
