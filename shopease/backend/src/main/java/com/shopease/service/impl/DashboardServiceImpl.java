package com.shopease.service.impl;

import com.shopease.dto.response.DashboardResponse;
import com.shopease.dto.response.OrderResponse;
import com.shopease.enums.OrderStatus;
import com.shopease.repository.*;
import com.shopease.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public DashboardResponse getDashboardStats() {
        return DashboardResponse.builder()
                .totalOrders(orderRepository.count())
                .pendingOrders(orderRepository.countByStatus(OrderStatus.PENDING))
                .deliveredOrders(orderRepository.countByStatus(OrderStatus.DELIVERED))
                .totalRevenue(orderRepository.getTotalRevenue())
                .totalProducts(productRepository.count())
                .totalUsers(userRepository.count())
                .recentOrders(orderRepository.findRecentOrders(PageRequest.of(0, 5))
                        .stream().map(o -> OrderResponse.builder()
                                .id(o.getId())
                                .customerName(o.getUser().getName())
                                .totalAmount(o.getTotalAmount())
                                .status(o.getStatus().name())
                                .createdAt(o.getCreatedAt()).build())
                        .collect(Collectors.toList()))
                .build();
    }
}
