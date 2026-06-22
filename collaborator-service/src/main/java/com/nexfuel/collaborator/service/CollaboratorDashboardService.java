package com.nexfuel.collaborator.service;

import com.nexfuel.collaborator.dto.*;
import com.nexfuel.collaborator.entity.*;
import com.nexfuel.collaborator.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CollaboratorDashboardService {

    private final CollaboratorRepository collaboratorRepository;
    private final ServiceAreaRepository serviceAreaRepository;
    private final CollaboratorService collaboratorService;
    private final ServiceAreaService serviceAreaService;

    @Transactional(readOnly = true)
    public CollaboratorDashboardResponse getDashboardData() {
        List<CollaboratorEntity> collaborators = collaboratorRepository.findAll();
        List<ServiceAreaEntity> serviceAreas = serviceAreaRepository.findAll();

        long totalCollaborators = collaborators.size();
        long activePartners = collaborators.stream()
                .filter(c -> c.getStatus() == CollaboratorStatus.ACTIVE_PARTNER)
                .count();
        long totalServiceAreas = serviceAreas.size();

        List<CollaboratorResponse> collaboratorResponses = collaborators.stream()
                .map(collaboratorService::mapToResponse)
                .collect(Collectors.toList());

        List<ServiceAreaResponse> serviceAreaResponses = serviceAreas.stream()
                .map(serviceAreaService::mapToResponse)
                .collect(Collectors.toList());

        return new CollaboratorDashboardResponse(
                totalCollaborators,
                activePartners,
                totalServiceAreas,
                collaboratorResponses,
                serviceAreaResponses
        );
    }
}
