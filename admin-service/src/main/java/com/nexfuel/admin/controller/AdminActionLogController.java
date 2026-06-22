package com.nexfuel.admin.controller;

import com.nexfuel.admin.entity.AdminActionLogEntity;
import com.nexfuel.admin.service.AdminActionLogService;
import com.nexfuel.shared.model.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/logs")
@RequiredArgsConstructor
@Tag(name = "Admin Actions Audit Logs API", description = "Admin only. Query audit logs matching security activities.")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminActionLogController {

    private final AdminActionLogService adminActionLogService;

    @GetMapping
    @Operation(summary = "Get admin action history log trails", description = "Query auditable activity history logs.")
    public ResponseEntity<ApiResponse<List<AdminActionLogEntity>>> getActionLogs() {
        List<AdminActionLogEntity> list = adminActionLogService.getAllActionLogs();
        return ResponseEntity.ok(ApiResponse.success("Admin action audit log trails retrieved successfully.", list));
    }
}
