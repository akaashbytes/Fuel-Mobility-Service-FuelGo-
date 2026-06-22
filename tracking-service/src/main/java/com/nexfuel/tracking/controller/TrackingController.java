package com.nexfuel.tracking.controller;

import com.nexfuel.shared.constant.SecurityConstants;
import com.nexfuel.shared.model.ApiResponse;
import com.nexfuel.tracking.dto.*;
import com.nexfuel.tracking.service.NotificationService;
import com.nexfuel.tracking.service.OrderTrackingService;
import com.nexfuel.tracking.service.ProviderLocationService;
import com.nexfuel.tracking.service.TrackingDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tracking")
@RequiredArgsConstructor
@Tag(name = "Logistics Tracking & Alert API", description = "Endpoints for provider location telemetry, customer order ETA timelines, alert broadcast distributions, and maps dashboard.")
public class TrackingController {

    private final ProviderLocationService providerLocationService;
    private final OrderTrackingService orderTrackingService;
    private final NotificationService notificationService;
    private final TrackingDashboardService dashboardService;

    @PostMapping("/location")
    @Operation(summary = "Update provider location", description = "Provider only. Submits coordinate updates (latitude/longitude) if provider status is ACTIVE.")
    public ResponseEntity<ApiResponse<ProviderLocationResponse>> updateLocation(
            @Valid @RequestBody ProviderLocationRequest request) {
        ProviderLocationResponse response = providerLocationService.updateLocation(request);
        return ResponseEntity.ok(ApiResponse.success("Location updated successfully.", response));
    }

    @GetMapping("/provider/{providerId}")
    @Operation(summary = "Get provider coordinates", description = "Retrieves current active coordinates and state for a provider.")
    public ResponseEntity<ApiResponse<ProviderLocationResponse>> getProviderLocation(@PathVariable Long providerId) {
        ProviderLocationResponse response = providerLocationService.getProviderLocation(providerId);
        return ResponseEntity.ok(ApiResponse.success("Provider location retrieved successfully.", response));
    }

    @GetMapping("/provider/nearest")
    @Operation(summary = "Find nearest providers", description = "Locates closest active AVAILABLE providers within a specific kilometer radius range.")
    public ResponseEntity<ApiResponse<List<ProviderLocationResponse>>> getNearestProviders(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "10.0") Double radiusKm) {
        List<ProviderLocationResponse> response = providerLocationService.getNearestProviders(latitude, longitude, radiusKm);
        return ResponseEntity.ok(ApiResponse.success("Nearest providers resolved successfully.", response));
    }

    @PostMapping("/order/start")
    @Operation(summary = "Start tracking order journey", description = "Admin/Order service dispatcher. Initializes dispatch route map tracking records.")
    public ResponseEntity<ApiResponse<OrderTrackingResponse>> startTracking(
            @RequestParam Long orderId,
            @RequestParam Long providerId,
            @RequestParam Long customerId) {
        OrderTrackingResponse response = orderTrackingService.startTracking(orderId, providerId, customerId);
        return ResponseEntity.ok(ApiResponse.success("Order journey tracking initialized.", response));
    }

    @PutMapping("/order/{orderId}")
    @Operation(summary = "Update order tracking timeline", description = "Provider dispatcher. Appends timeline coordinate logs, re-calculates distance/ETA updates.")
    public ResponseEntity<ApiResponse<OrderTrackingResponse>> updateOrderTracking(
            @PathVariable Long orderId,
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam String status) {
        OrderTrackingResponse response = orderTrackingService.updateOrderTracking(orderId, latitude, longitude, status);
        return ResponseEntity.ok(ApiResponse.success("Order tracking status updated.", response));
    }

    @GetMapping("/order/{orderId}")
    @Operation(summary = "Get order tracking stats", description = "Customer/Provider. Retrieves route map details, current ETA, remaining distance, and history trail.")
    public ResponseEntity<ApiResponse<OrderTrackingResponse>> getOrderTracking(@PathVariable Long orderId) {
        OrderTrackingResponse response = orderTrackingService.getOrderTracking(orderId);
        return ResponseEntity.ok(ApiResponse.success("Order tracking data retrieved.", response));
    }

    @PostMapping("/notifications")
    @Operation(summary = "Broadcast notification alert", description = "Registers alert event and pushes logs to user notification streams.")
    public ResponseEntity<ApiResponse<NotificationResponse>> createNotification(
            @RequestParam Long userId,
            @RequestParam String userRole,
            @RequestParam String title,
            @RequestParam String message) {
        NotificationResponse response = notificationService.createNotification(userId, userRole, title, message);
        return ResponseEntity.ok(ApiResponse.success("Notification sent successfully.", response));
    }

    @GetMapping("/notifications")
    @Operation(summary = "List user alerts history", description = "Reads authenticated user ID header and retrieves notification streams history.")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getUserNotifications(
            @RequestAttribute(SecurityConstants.HEADER_USER_ID) Long userId) {
        List<NotificationResponse> response = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(ApiResponse.success("User notifications retrieved successfully.", response));
    }

    @PutMapping("/notifications/{id}/read")
    @Operation(summary = "Mark alert as read", description = "Sets unread indicator to true for a notification entry.")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable String id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read.", null));
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Get live logistics dashboard", description = "Admin only. Returns aggregates of active providers, en route fleets, and notification details.")
    public ResponseEntity<ApiResponse<TrackingDashboardResponse>> getDashboard() {
        TrackingDashboardResponse response = dashboardService.getDashboardData();
        return ResponseEntity.ok(ApiResponse.success("Logistics dashboard details resolved.", response));
    }
}
