package com.nexfuel.customer.controller;

import com.nexfuel.customer.dto.CustomerDashboardResponse;
import com.nexfuel.customer.dto.CustomerProfileRequest;
import com.nexfuel.customer.dto.CustomerProfileResponse;
import com.nexfuel.shared.constant.SecurityConstants;
import com.nexfuel.customer.service.CustomerDashboardService;
import com.nexfuel.customer.service.CustomerProfileService;
import com.nexfuel.shared.model.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
@Tag(name = "Customer Profiles Center", description = "Endpoints for retrieving/updating customer profiles and dashboard summaries")
public class CustomerController {

    private final CustomerProfileService customerProfileService;
    private final CustomerDashboardService customerDashboardService;

    @GetMapping("/profile")
    @Operation(summary = "Retrieve customer profile", description = "Retrieves profile record for the authenticated user context")
    public ResponseEntity<ApiResponse<CustomerProfileResponse>> getProfile(
            @RequestAttribute(SecurityConstants.HEADER_USER_ID) Long userId) {
        CustomerProfileResponse profile = customerProfileService.getProfileByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully.", profile));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update customer profile address", description = "Modifies default delivery address settings")
    public ResponseEntity<ApiResponse<CustomerProfileResponse>> updateProfile(
            @RequestAttribute(SecurityConstants.HEADER_USER_ID) Long userId,
            @Valid @RequestBody CustomerProfileRequest request) {
        CustomerProfileResponse profile = customerProfileService.updateProfile(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully.", profile));
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Retrieve customer dashboard details", description = "Aggregates customer profile status and registered vehicles")
    public ResponseEntity<ApiResponse<CustomerDashboardResponse>> getDashboard(
            @RequestAttribute(SecurityConstants.HEADER_USER_ID) Long userId) {
        CustomerDashboardResponse dashboard = customerDashboardService.getDashboardData(userId);
        return ResponseEntity.ok(ApiResponse.success("Dashboard data retrieved successfully.", dashboard));
    }
}
