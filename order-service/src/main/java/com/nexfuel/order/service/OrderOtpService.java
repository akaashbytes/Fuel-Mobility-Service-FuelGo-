package com.nexfuel.order.service;

import com.nexfuel.order.dto.OrderResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderOtpService {

    private final OrderService orderService;

    public OrderResponse verifyOtp(Long orderId, String otpCode) {
        return orderService.verifyOtp(orderId, otpCode);
    }
}
