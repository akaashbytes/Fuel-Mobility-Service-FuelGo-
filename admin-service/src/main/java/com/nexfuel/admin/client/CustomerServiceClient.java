package com.nexfuel.admin.client;

import com.nexfuel.admin.dto.ClientDtos.CustomerDashboardResponse;
import com.nexfuel.admin.dto.ClientDtos.CustomerProfileResponse;
import com.nexfuel.shared.model.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "customer-service")
public interface CustomerServiceClient {

    @GetMapping("/api/v1/customers/profile")
    ApiResponse<CustomerProfileResponse> getProfile();

    @GetMapping("/api/v1/customers/dashboard")
    ApiResponse<CustomerDashboardResponse> getDashboard();
}
