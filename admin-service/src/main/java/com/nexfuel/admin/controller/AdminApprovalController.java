package com.nexfuel.admin.controller;

import com.nexfuel.admin.dto.ClientDtos.ProviderProfileResponse;
import com.nexfuel.admin.dto.ClientDtos.CollaboratorResponse;
import com.nexfuel.admin.dto.ProviderStatus;
import com.nexfuel.admin.dto.CollaboratorStatus;
import com.nexfuel.admin.service.AdminApprovalService;
import com.nexfuel.shared.constant.SecurityConstants;
import com.nexfuel.shared.model.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/approvals")
@RequiredArgsConstructor
@Tag(name = "Admin Approvals & Verifications API", description = "Admin only. Handles compliance verification approvals for provider vehicles and bunk collaborator agreements.")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminApprovalController {

    private final AdminApprovalService adminApprovalService;

    @PutMapping("/providers/{userId}")
    @Operation(summary = "Approve or update provider account status", description = "Updates provider compliance flag (ACTIVE, SUSPENDED, REJECTED) and logs action.")
    public ResponseEntity<ApiResponse<ProviderProfileResponse>> updateProviderStatus(
            @RequestAttribute(value = SecurityConstants.HEADER_USER_ID, required = false) Long adminId,
            @PathVariable("userId") Long providerUserId,
            @RequestParam("status") ProviderStatus status) {
        
        Long executorId = (adminId != null) ? adminId : 0L;
        ProviderProfileResponse response = adminApprovalService.approveProvider(providerUserId, status, executorId);
        return ResponseEntity.ok(ApiResponse.success("Provider status updated successfully.", response));
    }

    @PutMapping("/collaborators/{id}")
    @Operation(summary = "Approve or update collaborator partner status", description = "Sets collaborator station state (ACTIVE_PARTNER, SUSPENDED, INACTIVE) and audits log.")
    public ResponseEntity<ApiResponse<CollaboratorResponse>> updateCollaboratorStatus(
            @RequestAttribute(value = SecurityConstants.HEADER_USER_ID, required = false) Long adminId,
            @PathVariable("id") Long collaboratorId,
            @RequestParam("status") CollaboratorStatus status) {

        Long executorId = (adminId != null) ? adminId : 0L;
        CollaboratorResponse response = adminApprovalService.approveCollaborator(collaboratorId, status, executorId);
        return ResponseEntity.ok(ApiResponse.success("Collaborator status updated successfully.", response));
    }
}
