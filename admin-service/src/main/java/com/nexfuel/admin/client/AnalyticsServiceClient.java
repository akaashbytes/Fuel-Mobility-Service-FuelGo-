package com.nexfuel.admin.client;

import com.nexfuel.admin.dto.ClientDtos.AnalyticsDashboardResponse;
import com.nexfuel.admin.dto.ClientDtos.RevenueAnalyticsResponse;
import com.nexfuel.admin.dto.ClientDtos.ProviderAnalyticsResponse;
import com.nexfuel.admin.dto.ClientDtos.OrderAnalyticsResponse;
import com.nexfuel.admin.dto.ClientDtos.CustomerAnalyticsResponse;
import com.nexfuel.admin.dto.ClientDtos.CollaboratorAnalyticsResponse;
import com.nexfuel.shared.model.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "analytics-service")
public interface AnalyticsServiceClient {

    @GetMapping("/api/v1/analytics/dashboard")
    ApiResponse<AnalyticsDashboardResponse> getDashboard();

    @GetMapping("/api/v1/analytics/revenue")
    ApiResponse<RevenueAnalyticsResponse> getRevenueAnalytics(
            @RequestParam("snapshotType") String snapshotType
    );

    @GetMapping("/api/v1/analytics/providers")
    ApiResponse<ProviderAnalyticsResponse> getProviderAnalytics();

    @GetMapping("/api/v1/analytics/orders")
    ApiResponse<OrderAnalyticsResponse> getOrderAnalytics(
            @RequestParam("snapshotType") String snapshotType
    );

    @GetMapping("/api/v1/analytics/customers")
    ApiResponse<CustomerAnalyticsResponse> getCustomerAnalytics();

    @GetMapping("/api/v1/analytics/collaborators")
    ApiResponse<CollaboratorAnalyticsResponse> getCollaboratorAnalytics();

    @PostMapping("/api/v1/analytics/snapshots")
    ApiResponse<Void> triggerSnapshot(
            @RequestParam("snapshotType") String snapshotType
    );

    @PostMapping("/api/v1/analytics/logs")
    ApiResponse<Void> recordActivityLog(
            @RequestParam("userId") Long userId,
            @RequestParam("userRole") String userRole,
            @RequestParam("activityType") String activityType,
            @RequestParam("description") String description
    );
}
