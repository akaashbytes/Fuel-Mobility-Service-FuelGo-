package com.nexfuel.provider.controller;

import com.nexfuel.provider.dto.*;
import com.nexfuel.provider.service.*;
import com.nexfuel.shared.constant.SecurityConstants;
import com.nexfuel.shared.model.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/providers")
@RequiredArgsConstructor
@Tag(name = "Provider Center", description = "Endpoints for provider profile management, document verification, availability timeline settings, and earnings checkouts")
public class ProviderController {

    private final ProviderProfileService providerProfileService;
    private final ProviderDocumentService providerDocumentService;
    private final ProviderAvailabilityService providerAvailabilityService;
    private final ProviderEarningsService providerEarningsService;
    private final ProviderDashboardService providerDashboardService;

    @GetMapping("/profile")
    @Operation(summary = "Retrieve provider profile", description = "Retrieves profile record for the authenticated provider user context")
    public ResponseEntity<ApiResponse<ProviderProfileResponse>> getProfile(
            @RequestAttribute(SecurityConstants.HEADER_USER_ID) Long userId) {
        ProviderProfileResponse profile = providerProfileService.getProfileByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("Provider profile retrieved successfully.", profile));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update provider profile", description = "Allows updating provider profile status")
    public ResponseEntity<ApiResponse<ProviderProfileResponse>> updateProfile(
            @RequestAttribute(SecurityConstants.HEADER_USER_ID) Long userId,
            @Valid @RequestBody ProviderProfileRequest request) {
        ProviderProfileResponse profile = providerProfileService.updateProfile(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Provider profile updated successfully.", profile));
    }

    @PostMapping("/documents")
    @Operation(summary = "Upload compliance document", description = "Registers CDL, Hazmat, or other certifications")
    public ResponseEntity<ApiResponse<ProviderDocumentResponse>> uploadDocument(
            @RequestAttribute(SecurityConstants.HEADER_USER_ID) Long userId,
            @Valid @RequestBody ProviderDocumentRequest request) {
        ProviderDocumentResponse doc = providerDocumentService.uploadDocument(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Document uploaded successfully.", doc));
    }

    @GetMapping("/documents")
    @Operation(summary = "List compliance documents", description = "Retrieves all registered compliance documents")
    public ResponseEntity<ApiResponse<List<ProviderDocumentResponse>>> getDocuments(
            @RequestAttribute(SecurityConstants.HEADER_USER_ID) Long userId) {
        List<ProviderDocumentResponse> docs = providerDocumentService.getDocumentsByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("Compliance documents retrieved successfully.", docs));
    }

    @PutMapping("/availability")
    @Operation(summary = "Update availability state", description = "Sets status to AVAILABLE, UNAVAILABLE, or ON_JOB")
    public ResponseEntity<ApiResponse<ProviderAvailabilityResponse>> updateAvailability(
            @RequestAttribute(SecurityConstants.HEADER_USER_ID) Long userId,
            @Valid @RequestBody ProviderAvailabilityRequest request) {
        ProviderAvailabilityResponse availability = providerAvailabilityService.updateAvailability(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Availability status updated successfully.", availability));
    }

    @GetMapping("/availability")
    @Operation(summary = "Get current availability state", description = "Retrieves active availability status")
    public ResponseEntity<ApiResponse<ProviderAvailabilityResponse>> getAvailability(
            @RequestAttribute(SecurityConstants.HEADER_USER_ID) Long userId) {
        ProviderAvailabilityResponse availability = providerAvailabilityService.getCurrentAvailability(userId);
        return ResponseEntity.ok(ApiResponse.success("Current availability status retrieved successfully.", availability));
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get provider dashboard metrics", description = "Consolidates profile summary, current availability, document stats, and earnings data")
    public ResponseEntity<ApiResponse<ProviderDashboardResponse>> getDashboard(
            @RequestAttribute(SecurityConstants.HEADER_USER_ID) Long userId) {
        ProviderDashboardResponse dashboard = providerDashboardService.getDashboardData(userId);
        return ResponseEntity.ok(ApiResponse.success("Provider dashboard telemetry retrieved successfully.", dashboard));
    }

    @GetMapping("/earnings")
    @Operation(summary = "Get provider earnings overview", description = "Checks gross, paid, and pending earnings ledger balances")
    public ResponseEntity<ApiResponse<ProviderEarningsResponse>> getEarnings(
            @RequestAttribute(SecurityConstants.HEADER_USER_ID) Long userId) {
        ProviderEarningsResponse earnings = providerEarningsService.getEarningsByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("Earnings data retrieved successfully.", earnings));
    }
}
