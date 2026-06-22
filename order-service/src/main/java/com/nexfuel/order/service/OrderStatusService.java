package com.nexfuel.order.service;

import com.nexfuel.order.dto.OrderResponse;
import com.nexfuel.order.dto.OrderStatusUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderStatusService {

    private final OrderService orderService;

    public OrderResponse updateStatus(Long orderId, OrderStatusUpdateRequest request) {
        return orderService.updateStatus(orderId, request);
    }
}
