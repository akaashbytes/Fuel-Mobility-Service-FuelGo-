package com.nexfuel.admin.controller;

import com.nexfuel.admin.entity.SystemConfigurationEntity;
import com.nexfuel.admin.service.SystemConfigurationService;
import com.nexfuel.shared.constant.SecurityConstants;
import com.nexfuel.shared.model.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/configurations")
@RequiredArgsConstructor
@Tag(name = "System Configuration Management API", description = "Admin only. Configures global settings such as tax indexes, default commissions, or service variables.")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class SystemConfigurationController {

    private final SystemConfigurationService systemConfigurationService;

    @GetMapping
    @Operation(summary = "Get all global parameters", description = "Lists all global system configurations variables.")
    public ResponseEntity<ApiResponse<List<SystemConfigurationEntity>>> getConfigurations() {
        List<SystemConfigurationEntity> list = systemConfigurationService.getAllConfigurations();
        return ResponseEntity.ok(ApiResponse.success("System configurations retrieved successfully.", list));
    }

    @GetMapping("/{key}")
    @Operation(summary = "Get specific configuration value", description = "Queries parameter value by its key index.")
    public ResponseEntity<ApiResponse<String>> getConfigurationValue(@PathVariable("key") String key) {
        String value = systemConfigurationService.getConfigurationValue(key);
        return ResponseEntity.ok(ApiResponse.success("Configuration parameter value fetched successfully.", value));
    }

    @PutMapping
    @Operation(summary = "Update or create configuration key", description = "Creates or saves value/descriptions for system configurations.")
    public ResponseEntity<ApiResponse<SystemConfigurationEntity>> saveConfiguration(
            @RequestAttribute(value = SecurityConstants.HEADER_USER_ID, required = false) Long adminId,
            @RequestParam("key") String key,
            @RequestParam("value") String value,
            @RequestParam(value = "description", required = false) String description) {

        Long executorId = (adminId != null) ? adminId : 0L;
        SystemConfigurationEntity entity = systemConfigurationService.saveConfiguration(key, value, description, executorId);
        return ResponseEntity.ok(ApiResponse.success("Configuration parameter updated successfully.", entity));
    }
}
