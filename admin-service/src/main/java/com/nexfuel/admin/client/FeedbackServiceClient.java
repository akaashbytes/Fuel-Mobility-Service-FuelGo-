package com.nexfuel.admin.client;

import com.nexfuel.admin.dto.ClientDtos.AdminFeedbackDashboard;
import com.nexfuel.admin.dto.ClientDtos.FeedbackResponse;
import com.nexfuel.admin.dto.ClientDtos.FeedbackDetailResponse;
import com.nexfuel.admin.dto.ClientDtos.ProviderRatingSummary;
import com.nexfuel.shared.model.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "feedback-service")
public interface FeedbackServiceClient {

    @GetMapping("/api/v1/feedback/{id}")
    ApiResponse<FeedbackDetailResponse> getFeedbackById(@PathVariable("id") Long id);

    @GetMapping("/api/v1/feedback/provider/{providerId}")
    ApiResponse<List<FeedbackResponse>> getFeedbackByProvider(@PathVariable("providerId") Long providerId);

    @GetMapping("/api/v1/feedback/provider/{providerId}/summary")
    ApiResponse<ProviderRatingSummary> getProviderRatingSummary(@PathVariable("providerId") Long providerId);

    @PostMapping("/api/v1/feedback/{id}/response")
    ApiResponse<FeedbackDetailResponse> addAdminResponse(
            @PathVariable("id") Long id,
            @RequestParam("responseComment") String responseComment
    );

    @GetMapping("/api/v1/feedback/dashboard")
    ApiResponse<AdminFeedbackDashboard> getDashboard();
}
