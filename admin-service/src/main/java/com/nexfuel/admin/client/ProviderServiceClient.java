package com.nexfuel.admin.client;

import com.nexfuel.admin.dto.ClientDtos.ProviderDashboardResponse;
import com.nexfuel.admin.dto.ClientDtos.ProviderProfileResponse;
import com.nexfuel.admin.dto.ClientDtos.ProviderProfileRequest;
import com.nexfuel.admin.dto.ClientDtos.ProviderEarningsResponse;
import com.nexfuel.admin.dto.ClientDtos.ProviderDocumentResponse;
import com.nexfuel.shared.model.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@FeignClient(name = "provider-service")
public interface ProviderServiceClient {

    @GetMapping("/api/v1/providers/profile")
    ApiResponse<ProviderProfileResponse> getProfile();

    @PutMapping("/api/v1/providers/profile")
    ApiResponse<ProviderProfileResponse> updateProfile(
            @RequestHeader(com.nexfuel.shared.constant.SecurityConstants.HEADER_USER_ID) Long providerUserId,
            @RequestBody ProviderProfileRequest request
    );

    @GetMapping("/api/v1/providers/dashboard")
    ApiResponse<ProviderDashboardResponse> getDashboard();

    @GetMapping("/api/v1/providers/earnings")
    ApiResponse<ProviderEarningsResponse> getEarnings();

    @GetMapping("/api/v1/providers/documents")
    ApiResponse<List<ProviderDocumentResponse>> getDocuments();
}
