package com.nexfuel.admin.client;

import com.nexfuel.admin.dto.ClientDtos.TrackingDashboardResponse;
import com.nexfuel.admin.dto.ClientDtos.ProviderLocationResponse;
import com.nexfuel.admin.dto.ClientDtos.OrderTrackingResponse;
import com.nexfuel.admin.dto.ClientDtos.NotificationResponse;
import com.nexfuel.shared.model.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "tracking-service")
public interface TrackingServiceClient {

    @GetMapping("/api/v1/tracking/provider/{providerId}")
    ApiResponse<ProviderLocationResponse> getProviderLocation(@PathVariable("providerId") Long providerId);

    @GetMapping("/api/v1/tracking/order/{orderId}")
    ApiResponse<OrderTrackingResponse> getOrderTracking(@PathVariable("orderId") Long orderId);

    @PostMapping("/api/v1/tracking/order/start")
    ApiResponse<OrderTrackingResponse> startTracking(
            @RequestParam("orderId") Long orderId,
            @RequestParam("providerId") Long providerId,
            @RequestParam("customerId") Long customerId
    );

    @PutMapping("/api/v1/tracking/order/{orderId}")
    ApiResponse<OrderTrackingResponse> updateOrderTracking(
            @PathVariable("orderId") Long orderId,
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude,
            @RequestParam("status") String status
    );

    @PostMapping("/api/v1/tracking/notifications")
    ApiResponse<NotificationResponse> createNotification(
            @RequestParam("userId") Long userId,
            @RequestParam("userRole") String userRole,
            @RequestParam("title") String title,
            @RequestParam("message") String message
    );

    @GetMapping("/api/v1/tracking/dashboard")
    ApiResponse<TrackingDashboardResponse> getDashboard();
}
