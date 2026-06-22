package com.nexfuel.feedback.controller;

import com.nexfuel.feedback.dto.*;
import com.nexfuel.feedback.service.FeedbackDashboardService;
import com.nexfuel.feedback.service.FeedbackResponseService;
import com.nexfuel.feedback.service.FeedbackService;
import com.nexfuel.feedback.service.ProviderRatingService;
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
@RequestMapping("/api/v1/feedback")
@RequiredArgsConstructor
@Tag(name = "Customer Feedback API", description = "Endpoints for customer review submissions, ratings logs, administrative review responses, and metrics dashboards.")
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final FeedbackResponseService responseService;
    private final ProviderRatingService providerRatingService;
    private final FeedbackDashboardService dashboardService;

    @PostMapping
    @Operation(summary = "Submit customer feedback", description = "Customer only. Submits rating and optional comment for a completed order.")
    public ResponseEntity<ApiResponse<FeedbackResponse>> submitFeedback(
            @RequestAttribute(SecurityConstants.HEADER_USER_ID) Long customerId,
            @Valid @RequestBody FeedbackRequest request) {
        FeedbackResponse response = feedbackService.submitFeedback(customerId, request);
        return ResponseEntity.ok(ApiResponse.success("Feedback submitted successfully.", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get feedback details", description = "Retrieves feedback record and the corresponding administrator response followups.")
    public ResponseEntity<ApiResponse<FeedbackDetailResponse>> getFeedbackById(@PathVariable Long id) {
        FeedbackDetailResponse response = feedbackService.getFeedbackById(id);
        return ResponseEntity.ok(ApiResponse.success("Feedback retrieved successfully.", response));
    }

    @GetMapping("/provider/{providerId}")
    @Operation(summary = "Get provider review list", description = "Retrieves review lists submitted for a specific provider ID.")
    public ResponseEntity<ApiResponse<List<FeedbackResponse>>> getFeedbackByProvider(@PathVariable Long providerId) {
        List<FeedbackResponse> response = feedbackService.getFeedbackByProvider(providerId);
        return ResponseEntity.ok(ApiResponse.success("Provider feedback list retrieved successfully.", response));
    }

    @GetMapping("/provider/{providerId}/summary")
    @Operation(summary = "Get provider rating summary", description = "Aggregates rating values (average score, total review count) for a provider partner.")
    public ResponseEntity<ApiResponse<ProviderRatingSummary>> getProviderRatingSummary(@PathVariable Long providerId) {
        ProviderRatingSummary response = providerRatingService.getProviderRatingSummary(providerId);
        return ResponseEntity.ok(ApiResponse.success("Provider rating summary retrieved successfully.", response));
    }

    @GetMapping("/customer")
    @Operation(summary = "Get calling customer's feedback history", description = "Customer only. Retrieves all reviews submitted by the authenticated customer context.")
    public ResponseEntity<ApiResponse<List<FeedbackResponse>>> getFeedbackByCustomer(
            @RequestAttribute(SecurityConstants.HEADER_USER_ID) Long customerId) {
        List<FeedbackResponse> response = feedbackService.getFeedbackByCustomer(customerId);
        return ResponseEntity.ok(ApiResponse.success("Customer feedback history retrieved successfully.", response));
    }

    @PostMapping("/{id}/response")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Submit administrative response", description = "Admin only. Registers a response comment for customer review resolution.")
    public ResponseEntity<ApiResponse<FeedbackDetailResponse>> addAdminResponse(
            @RequestAttribute(SecurityConstants.HEADER_USER_ID) Long adminId,
            @PathVariable Long id,
            @RequestParam String responseComment) {
        FeedbackDetailResponse response = responseService.addAdminResponse(adminId, id, responseComment);
        return ResponseEntity.ok(ApiResponse.success("Response recorded successfully.", response));
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Get admin feedback metrics overview", description = "Admin only. Consolidated metrics of system-wide ratings and pending reviews.")
    public ResponseEntity<ApiResponse<AdminFeedbackDashboard>> getDashboard() {
        AdminFeedbackDashboard response = dashboardService.getDashboardData();
        return ResponseEntity.ok(ApiResponse.success("Feedback dashboard stats retrieved successfully.", response));
    }
}
