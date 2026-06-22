package com.nexfuel.order.service;

import com.nexfuel.order.dto.OrderDashboardResponse;
import com.nexfuel.order.dto.OrderResponse;
import com.nexfuel.order.entity.OrderEntity;
import com.nexfuel.order.entity.OrderState;
import com.nexfuel.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderDashboardService {

    private final OrderRepository orderRepository;
    private final OrderService orderService;

    @Transactional(readOnly = true)
    public OrderDashboardResponse getDashboardData() {
        List<OrderEntity> allOrders = orderRepository.findAll();

        long totalOrders = allOrders.size();
        long pendingOrders = allOrders.stream()
                .filter(o -> o.getStatus() == OrderState.PENDING)
                .count();
        long activeOrders = allOrders.stream()
                .filter(o -> o.getStatus() != OrderState.PENDING 
                        && o.getStatus() != OrderState.COMPLETED 
                        && o.getStatus() != OrderState.CANCELLED)
                .count();
        long completedOrders = allOrders.stream()
                .filter(o -> o.getStatus() == OrderState.COMPLETED)
                .count();
        long cancelledOrders = allOrders.stream()
                .filter(o -> o.getStatus() == OrderState.CANCELLED)
                .count();

        // Get the latest 10 orders sorted by creation date descending
        List<OrderResponse> recentOrders = allOrders.stream()
                .sorted((o1, o2) -> {
                    if (o1.getCreatedAt() == null) return 1;
                    if (o2.getCreatedAt() == null) return -1;
                    return o2.getCreatedAt().compareTo(o1.getCreatedAt());
                })
                .limit(10)
                .map(orderService::mapToResponse)
                .collect(Collectors.toList());

        return new OrderDashboardResponse(
                totalOrders,
                pendingOrders,
                activeOrders,
                completedOrders,
                cancelledOrders,
                recentOrders
        );
    }
}
