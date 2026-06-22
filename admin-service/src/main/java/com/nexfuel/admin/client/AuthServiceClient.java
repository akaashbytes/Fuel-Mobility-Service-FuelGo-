package com.nexfuel.admin.client;

import com.nexfuel.admin.dto.ClientDtos.UserProfileResponse;
import com.nexfuel.shared.model.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "auth-service")
public interface AuthServiceClient {

    @GetMapping("/api/v1/auth/profile")
    ApiResponse<UserProfileResponse> getProfile();
}
