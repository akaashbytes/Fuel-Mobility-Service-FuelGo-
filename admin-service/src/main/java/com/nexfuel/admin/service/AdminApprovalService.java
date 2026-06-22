package com.nexfuel.admin.service;

import com.nexfuel.admin.dto.ClientDtos.ProviderProfileResponse;
import com.nexfuel.admin.dto.ClientDtos.CollaboratorResponse;
import com.nexfuel.admin.dto.ProviderStatus;
import com.nexfuel.admin.dto.CollaboratorStatus;

public interface AdminApprovalService {
    ProviderProfileResponse approveProvider(Long providerUserId, ProviderStatus status, Long adminId);
    CollaboratorResponse approveCollaborator(Long collaboratorId, CollaboratorStatus status, Long adminId);
}
