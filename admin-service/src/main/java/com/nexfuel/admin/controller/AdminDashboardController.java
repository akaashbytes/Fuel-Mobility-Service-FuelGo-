package com.nexfuel.admin.controller;

import com.nexfuel.admin.dto.AdminDashboardResponse;
import com.nexfuel.admin.service.AdminDashboardService;
import com.nexfuel.shared.model.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
@Tag(name = "Admin Unified Dashboard API", description = "Admin only. Consolidates metric summaries from all microservices (User status counts, completed orders logs, ledger values, ratings).")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping
    @Operation(summary = "Get aggregated admin dashboard telemetry", description = "Query and consolidate dashboard metrics from order, tracking, payment, collaborator, and feedback services.")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getDashboard() {
        AdminDashboardResponse response = adminDashboardService.getDashboardData();
        return ResponseEntity.ok(ApiResponse.success("Consolidated administrative dashboard telemetry resolved successfully.", response));
    }
}
