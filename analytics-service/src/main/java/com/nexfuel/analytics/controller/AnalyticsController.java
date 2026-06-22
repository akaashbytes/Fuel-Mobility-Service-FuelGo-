package com.nexfuel.analytics.controller;

import com.nexfuel.analytics.dto.*;
import com.nexfuel.analytics.service.*;
import com.nexfuel.shared.constant.SecurityConstants;
import com.nexfuel.shared.model.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@Tag(name = "Business Intelligence & Analytics API", description = "Admin only. Endpoints for system-wide revenues growth, fleet provider scores, delivery rates, customer behavior, bunk pricing trends, and metrics snapshots.")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AnalyticsController {

    private final AnalyticsDashboardService dashboardService;
    private final RevenueAnalyticsService revenueAnalyticsService;
    private final ProviderAnalyticsService providerAnalyticsService;
    private final OrderAnalyticsService orderAnalyticsService;
    private final CustomerAnalyticsService customerAnalyticsService;
    private final CollaboratorAnalyticsService collaboratorAnalyticsService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get system analytics overview", description = "Admin only. Returns aggregate system health details (revenues, orders count, driver ratings, active lists, and recent activity trails).")
    public ResponseEntity<ApiResponse<AnalyticsDashboardResponse>> getDashboard() {
        AnalyticsDashboardResponse response = dashboardService.getDashboardData();
        return ResponseEntity.ok(ApiResponse.success("Analytics dashboard details resolved successfully.", response));
    }

    @GetMapping("/revenue")
    @Operation(summary = "Get financial growth logs", description = "Admin only. Returns pricing snapshot records and growth indices comparing prior periods.")
    public ResponseEntity<ApiResponse<RevenueAnalyticsResponse>> getRevenueAnalytics(
            @RequestParam(defaultValue = "DAILY") String snapshotType) {
        RevenueAnalyticsResponse response = revenueAnalyticsService.getRevenueAnalytics(snapshotType);
        return ResponseEntity.ok(ApiResponse.success("Revenue analytics resolved successfully.", response));
    }

    @GetMapping("/providers")
    @Operation(summary = "Get driver fleet stats", description = "Admin only. Compiles total active providers count, system ratings average, and top performing provider rankings.")
    public ResponseEntity<ApiResponse<ProviderAnalyticsResponse>> getProviderAnalytics() {
        ProviderAnalyticsResponse response = providerAnalyticsService.getProviderAnalytics();
        return ResponseEntity.ok(ApiResponse.success("Provider analytics resolved successfully.", response));
    }

    @GetMapping("/orders")
    @Operation(summary = "Get delivery success metrics", description = "Admin only. Yields system-wide order completion and cancellation percentages.")
    public ResponseEntity<ApiResponse<OrderAnalyticsResponse>> getOrderAnalytics(
            @RequestParam(defaultValue = "DAILY") String snapshotType) {
        OrderAnalyticsResponse response = orderAnalyticsService.getOrderAnalytics(snapshotType);
        return ResponseEntity.ok(ApiResponse.success("Order analytics resolved successfully.", response));
    }

    @GetMapping("/customers")
    @Operation(summary = "Get customer registrations analytics", description = "Admin only. Tracks active customers counts, recent signup numbers, and ordering frequencies.")
    public ResponseEntity<ApiResponse<CustomerAnalyticsResponse>> getCustomerAnalytics() {
        CustomerAnalyticsResponse response = customerAnalyticsService.getCustomerAnalytics();
        return ResponseEntity.ok(ApiResponse.success("Customer analytics resolved successfully.", response));
    }

    @GetMapping("/collaborators")
    @Operation(summary = "Get collaborator bunk station logs", description = "Admin only. Tracks partner counts and average/min/max fuel pricing trends.")
    public ResponseEntity<ApiResponse<CollaboratorAnalyticsResponse>> getCollaboratorAnalytics() {
        CollaboratorAnalyticsResponse response = collaboratorAnalyticsService.getCollaboratorAnalytics();
        return ResponseEntity.ok(ApiResponse.success("Collaborator analytics resolved successfully.", response));
    }

    @PostMapping("/snapshots")
    @Operation(summary = "Generate snapshot", description = "Admin only. Triggers collection of system metrics into a DAILY, WEEKLY, or MONTHLY snapshots database.")
    public ResponseEntity<ApiResponse<Void>> triggerSnapshot(@RequestParam String snapshotType) {
        dashboardService.generateSnapshot(snapshotType);
        return ResponseEntity.ok(ApiResponse.success("Snapshot generated successfully."));
    }

    @PostMapping("/logs")
    @Operation(summary = "Record system activity", description = "Dispatcher/API Gateway. Registers a user activity log event.")
    public ResponseEntity<ApiResponse<Void>> recordActivityLog(
            @RequestParam Long userId,
            @RequestParam String userRole,
            @RequestParam String activityType,
            @RequestParam String description) {
        dashboardService.recordActivityLog(userId, userRole, activityType, description);
        return ResponseEntity.ok(ApiResponse.success("Activity logged successfully."));
    }
}
