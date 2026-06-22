package com.nexfuel.order.controller;

import com.nexfuel.order.dto.*;
import com.nexfuel.order.entity.ServicePackageEntity;
import com.nexfuel.order.service.*;
import com.nexfuel.shared.constant.SecurityConstants;
import com.nexfuel.shared.model.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Order Management", description = "Endpoints for order lifecycle management, provider assignment, OTP verification, service packages, and statistics dashboard")
public class OrderController {

    private final OrderService orderService;
    private final OrderStatusService orderStatusService;
    private final OrderOtpService orderOtpService;
    private final OrderDashboardService orderDashboardService;
    private final ServicePackageService servicePackageService;

    @PostMapping("/orders")
    @Operation(summary = "Create fuel order request", description = "Registers a new pending fuel delivery request for the customer")
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @RequestAttribute(SecurityConstants.HEADER_USER_ID) Long userId,
            @Valid @RequestBody CreateOrderRequest request) {
        OrderResponse response = orderService.createOrder(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Order created successfully.", response));
    }

    @GetMapping("/orders/{id}")
    @Operation(summary = "Get order details", description = "Retrieves information about a specific order by ID")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long id) {
        OrderResponse response = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success("Order retrieved successfully.", response));
    }

    @GetMapping("/orders/customer")
    @Operation(summary = "Get customer order history", description = "Retrieves all order records matching the calling customer ID")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrdersByCustomer(
            @RequestAttribute(SecurityConstants.HEADER_USER_ID) Long customerId) {
        List<OrderResponse> response = orderService.getOrdersByCustomer(customerId);
        return ResponseEntity.ok(ApiResponse.success("Customer orders retrieved successfully.", response));
    }

    @GetMapping("/orders")
    @Operation(summary = "Get all orders", description = "Lists all order entries in the system (typically for Admin or Provider dispatcher)")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders() {
        List<OrderResponse> response = orderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.success("All orders retrieved successfully.", response));
    }

    @PutMapping("/orders/{id}/status")
    @Operation(summary = "Update order status", description = "Transitions order status. Ensures forward-only progression rules and blocks changes on cancelled/completed orders")
    public ResponseEntity<ApiResponse<OrderResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        OrderResponse response = orderStatusService.updateStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Order status updated successfully.", response));
    }

    @PostMapping("/orders/{id}/assign")
    @Operation(summary = "Assign provider to order", description = "Assigns an available provider partner to fulfill the order")
    public ResponseEntity<ApiResponse<OrderResponse>> assignProvider(
            @PathVariable Long id,
            @Valid @RequestBody OrderAssignmentRequest request) {
        OrderResponse response = orderService.assignProvider(id, request.getProviderId());
        return ResponseEntity.ok(ApiResponse.success("Provider assigned successfully.", response));
    }

    @PostMapping("/orders/{id}/verify-otp")
    @Operation(summary = "Verify delivery OTP code", description = "Validates the customer delivery OTP. Matches, expires or transitions order to COMPLETED status upon success")
    public ResponseEntity<ApiResponse<OrderResponse>> verifyOtp(
            @PathVariable Long id,
            @Valid @RequestBody OtpVerificationRequest request) {
        OrderResponse response = orderOtpService.verifyOtp(id, request.getOtpCode());
        return ResponseEntity.ok(ApiResponse.success("OTP verified successfully and order completed.", response));
    }

    @GetMapping("/orders/dashboard")
    @Operation(summary = "Get order dashboard statistics", description = "Aggregates count values of orders by states (pending, active, completed, cancelled) and recent records")
    public ResponseEntity<ApiResponse<OrderDashboardResponse>> getDashboard() {
        OrderDashboardResponse response = orderDashboardService.getDashboardData();
        return ResponseEntity.ok(ApiResponse.success("Order dashboard data retrieved successfully.", response));
    }

    @GetMapping("/service-packages")
    @Operation(summary = "Get active service packages", description = "Lists standard active service pricing packages")
    public ResponseEntity<ApiResponse<List<ServicePackageResponse>>> getActivePackages() {
        List<ServicePackageResponse> response = servicePackageService.getActivePackages();
        return ResponseEntity.ok(ApiResponse.success("Active service packages retrieved successfully.", response));
    }

    @PostMapping("/service-packages")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Create service package", description = "Admin only. Creates a new standard service pricing package")
    public ResponseEntity<ApiResponse<ServicePackageResponse>> createServicePackage(
            @Valid @RequestBody ServicePackageEntity entity) {
        ServicePackageResponse response = servicePackageService.createPackage(entity);
        return ResponseEntity.ok(ApiResponse.success("Service package created successfully.", response));
    }
}
