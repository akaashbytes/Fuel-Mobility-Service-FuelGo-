package com.nexfuel.admin.service.impl;

import com.nexfuel.admin.client.ProviderServiceClient;
import com.nexfuel.admin.client.CollaboratorServiceClient;
import com.nexfuel.admin.dto.ClientDtos.ProviderProfileResponse;
import com.nexfuel.admin.dto.ClientDtos.ProviderProfileRequest;
import com.nexfuel.admin.dto.ClientDtos.CollaboratorResponse;
import com.nexfuel.admin.dto.ClientDtos.CollaboratorRequest;
import com.nexfuel.admin.dto.ProviderStatus;
import com.nexfuel.admin.dto.CollaboratorStatus;
import com.nexfuel.admin.entity.AdminActionLogEntity;
import com.nexfuel.admin.repository.AdminActionLogRepository;
import com.nexfuel.admin.service.AdminApprovalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminApprovalServiceImpl implements AdminApprovalService {

    private final ProviderServiceClient providerServiceClient;
    private final CollaboratorServiceClient collaboratorServiceClient;
    private final AdminActionLogRepository adminActionLogRepository;

    @Override
    @Transactional
    public ProviderProfileResponse approveProvider(Long providerUserId, ProviderStatus status, Long adminId) {
        log.info("Admin {} attempting status change for provider user ID {} to {}", adminId, providerUserId, status);

        ProviderProfileRequest request = ProviderProfileRequest.builder()
                .status(status)
                .build();

        ProviderProfileResponse response = providerServiceClient.updateProfile(providerUserId, request).data();

        // Log administrative action
        AdminActionLogEntity actionLog = new AdminActionLogEntity();
        actionLog.setAdminId(adminId);
        actionLog.setActionType("PROVIDER_STATUS_UPDATE");
        actionLog.setDetails("Updated provider user ID " + providerUserId + " status to " + status);
        adminActionLogRepository.save(actionLog);

        return response;
    }

    @Override
    @Transactional
    public CollaboratorResponse approveCollaborator(Long collaboratorId, CollaboratorStatus status, Long adminId) {
        log.info("Admin {} attempting status change for collaborator bunk ID {} to {}", adminId, collaboratorId, status);

        CollaboratorResponse existingCollab = collaboratorServiceClient.getCollaboratorById(collaboratorId).data();
        if (existingCollab == null) {
            throw new com.nexfuel.shared.exception.BaseException(
                    com.nexfuel.shared.exception.ErrorCode.RESOURCE_NOT_FOUND,
                    "Collaborator partner not found with ID " + collaboratorId
            );
        }

        CollaboratorRequest request = CollaboratorRequest.builder()
                .name(existingCollab.getName())
                .contactPerson(existingCollab.getContactPerson())
                .email(existingCollab.getEmail())
                .phoneNumber(existingCollab.getPhoneNumber())
                .address(existingCollab.getAddress())
                .status(status)
                .contractExpiryDate(existingCollab.getContractExpiryDate())
                .notes(existingCollab.getNotes())
                .latitude(existingCollab.getLatitude())
                .longitude(existingCollab.getLongitude())
                .serviceAreaIds(existingCollab.getServiceAreaIds())
                .build();

        CollaboratorResponse response = collaboratorServiceClient.updateCollaborator(collaboratorId, request).data();

        // Log administrative action
        AdminActionLogEntity actionLog = new AdminActionLogEntity();
        actionLog.setAdminId(adminId);
        actionLog.setActionType("COLLABORATOR_STATUS_UPDATE");
        actionLog.setDetails("Updated collaborator ID " + collaboratorId + " status to " + status);
        adminActionLogRepository.save(actionLog);

        return response;
    }
}
