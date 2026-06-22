package com.nexfuel.admin.client;

import com.nexfuel.admin.dto.ClientDtos.OrderDashboardResponse;
import com.nexfuel.admin.dto.ClientDtos.OrderResponse;
import com.nexfuel.admin.dto.ClientDtos.OrderStatusUpdateRequest;
import com.nexfuel.admin.dto.ClientDtos.OrderAssignmentRequest;
import com.nexfuel.admin.dto.ClientDtos.ServicePackageResponse;
import com.nexfuel.admin.dto.ClientDtos.ServicePackageRequest;
import com.nexfuel.shared.model.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "order-service")
public interface OrderServiceClient {

    @GetMapping("/api/v1/orders")
    ApiResponse<List<OrderResponse>> getAllOrders();

    @GetMapping("/api/v1/orders/{id}")
    ApiResponse<OrderResponse> getOrderById(@PathVariable("id") Long id);

    @PutMapping("/api/v1/orders/{id}/status")
    ApiResponse<OrderResponse> updateStatus(@PathVariable("id") Long id, @RequestBody OrderStatusUpdateRequest request);

    @PostMapping("/api/v1/orders/{id}/assign")
    ApiResponse<OrderResponse> assignProvider(@PathVariable("id") Long id, @RequestBody OrderAssignmentRequest request);

    @GetMapping("/api/v1/orders/dashboard")
    ApiResponse<OrderDashboardResponse> getDashboard();

    @PostMapping("/api/v1/service-packages")
    ApiResponse<ServicePackageResponse> createServicePackage(@RequestBody ServicePackageRequest request);

    @GetMapping("/api/v1/service-packages")
    ApiResponse<List<ServicePackageResponse>> getActivePackages();
}
