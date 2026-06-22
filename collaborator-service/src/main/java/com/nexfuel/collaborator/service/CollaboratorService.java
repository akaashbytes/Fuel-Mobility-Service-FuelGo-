package com.nexfuel.collaborator.service;

import com.nexfuel.collaborator.dto.CollaboratorRequest;
import com.nexfuel.collaborator.dto.CollaboratorResponse;
import com.nexfuel.collaborator.entity.*;
import com.nexfuel.collaborator.exception.*;
import com.nexfuel.collaborator.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CollaboratorService {

    private final CollaboratorRepository collaboratorRepository;
    private final ServiceAreaRepository serviceAreaRepository;
    private final CollaboratorServiceAreaRepository collaboratorServiceAreaRepository;

    @Transactional
    public CollaboratorResponse createCollaborator(CollaboratorRequest request) {
        // Validation: duplicate check
        if (collaboratorRepository.existsByEmail(request.getEmail())) {
            throw new CollaboratorValidationException("Collaborator with email " + request.getEmail() + " already exists.");
        }

        // Validation: must belong to at least one service area
        if (request.getServiceAreaIds() == null || request.getServiceAreaIds().isEmpty()) {
            throw new CollaboratorValidationException("Collaborator must be associated with at least one service area.");
        }

        CollaboratorEntity collaborator = new CollaboratorEntity();
        collaborator.setName(request.getName());
        collaborator.setContactPerson(request.getContactPerson());
        collaborator.setEmail(request.getEmail());
        collaborator.setPhoneNumber(request.getPhoneNumber());
        collaborator.setAddress(request.getAddress());
        collaborator.setStatus(request.getStatus() != null ? request.getStatus() : CollaboratorStatus.PROSPECT);
        collaborator.setContractExpiryDate(request.getContractExpiryDate());
        collaborator.setNotes(request.getNotes());
        collaborator.setLatitude(request.getLatitude());
        collaborator.setLongitude(request.getLongitude());

        CollaboratorEntity savedCollaborator = collaboratorRepository.save(collaborator);

        // Map service areas
        for (Long serviceAreaId : request.getServiceAreaIds()) {
            ServiceAreaEntity serviceArea = serviceAreaRepository.findById(serviceAreaId)
                    .orElseThrow(() -> new ServiceAreaNotFoundException("Service area not found with ID: " + serviceAreaId));

            CollaboratorServiceAreaEntity association = new CollaboratorServiceAreaEntity(savedCollaborator, serviceArea);
            collaboratorServiceAreaRepository.save(association);
            savedCollaborator.getServiceAreas().add(association);
        }

        return mapToResponse(savedCollaborator);
    }

    @Transactional(readOnly = true)
    public List<CollaboratorResponse> getAllCollaborators() {
        return collaboratorRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CollaboratorResponse getCollaboratorById(Long id) {
        CollaboratorEntity collaborator = collaboratorRepository.findById(id)
                .orElseThrow(() -> new CollaboratorNotFoundException("Collaborator not found with ID: " + id));
        return mapToResponse(collaborator);
    }

    @Transactional
    public CollaboratorResponse updateCollaborator(Long id, CollaboratorRequest request) {
        CollaboratorEntity collaborator = collaboratorRepository.findById(id)
                .orElseThrow(() -> new CollaboratorNotFoundException("Collaborator not found with ID: " + id));

        // Validation: email change duplicate check
        if (!collaborator.getEmail().equalsIgnoreCase(request.getEmail()) && collaboratorRepository.existsByEmail(request.getEmail())) {
            throw new CollaboratorValidationException("Collaborator with email " + request.getEmail() + " already exists.");
        }

        // Validation: must belong to at least one service area
        if (request.getServiceAreaIds() == null || request.getServiceAreaIds().isEmpty()) {
            throw new CollaboratorValidationException("Collaborator must be associated with at least one service area.");
        }

        collaborator.setName(request.getName());
        collaborator.setContactPerson(request.getContactPerson());
        collaborator.setEmail(request.getEmail());
        collaborator.setPhoneNumber(request.getPhoneNumber());
        collaborator.setAddress(request.getAddress());
        if (request.getStatus() != null) {
            collaborator.setStatus(request.getStatus());
        }
        collaborator.setContractExpiryDate(request.getContractExpiryDate());
        collaborator.setNotes(request.getNotes());
        collaborator.setLatitude(request.getLatitude());
        collaborator.setLongitude(request.getLongitude());

        // Clear existing service areas
        collaboratorServiceAreaRepository.deleteAll(collaborator.getServiceAreas());
        collaborator.getServiceAreas().clear();

        // Assign new service areas
        for (Long serviceAreaId : request.getServiceAreaIds()) {
            ServiceAreaEntity serviceArea = serviceAreaRepository.findById(serviceAreaId)
                    .orElseThrow(() -> new ServiceAreaNotFoundException("Service area not found with ID: " + serviceAreaId));

            CollaboratorServiceAreaEntity association = new CollaboratorServiceAreaEntity(collaborator, serviceArea);
            collaboratorServiceAreaRepository.save(association);
            collaborator.getServiceAreas().add(association);
        }

        CollaboratorEntity updated = collaboratorRepository.save(collaborator);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteCollaborator(Long id) {
        if (!collaboratorRepository.existsById(id)) {
            throw new CollaboratorNotFoundException("Collaborator not found with ID: " + id);
        }
        collaboratorRepository.deleteById(id);
    }

    // ==========================================
    // Bonus Features: Geo Search & Filters
    // ==========================================

    @Transactional(readOnly = true)
    public CollaboratorResponse findNearestCollaborator(Double targetLat, Double targetLon, String fuelType) {
        List<CollaboratorEntity> activeCollaborators = collaboratorRepository.findAll().stream()
                .filter(c -> c.getStatus() == CollaboratorStatus.ACTIVE_PARTNER)
                .filter(c -> c.getLatitude() != null && c.getLongitude() != null)
                .collect(Collectors.toList());

        if (activeCollaborators.isEmpty()) {
            throw new CollaboratorNotFoundException("No active collaborators found with coordinate data.");
        }

        CollaboratorEntity nearest = null;
        double minDistance = Double.MAX_VALUE;

        for (CollaboratorEntity c : activeCollaborators) {
            // Filter by pricing availability if fuelType is specified
            if (fuelType != null && !fuelType.trim().isEmpty()) {
                boolean hasFuel = c.getFuelPricings().stream()
                        .anyMatch(pricing -> pricing.getFuelType().equalsIgnoreCase(fuelType));
                if (!hasFuel) {
                    continue;
                }
            }

            double distance = calculateDistance(targetLat, targetLon, c.getLatitude(), c.getLongitude());
            if (distance < minDistance) {
                minDistance = distance;
                nearest = c;
            }
        }

        if (nearest == null) {
            throw new CollaboratorNotFoundException("No active collaborator found matching fuel type requirements: " + fuelType);
        }

        return mapToResponse(nearest);
    }

    @Transactional(readOnly = true)
    public List<CollaboratorResponse> findCollaboratorsByRegion(Long serviceAreaId) {
        return collaboratorServiceAreaRepository.findByServiceAreaId(serviceAreaId).stream()
                .map(CollaboratorServiceAreaEntity::getCollaborator)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CollaboratorResponse> findCollaboratorsByFuelType(String fuelType) {
        return collaboratorRepository.findAll().stream()
                .filter(c -> c.getFuelPricings().stream()
                        .anyMatch(p -> p.getFuelType().equalsIgnoreCase(fuelType)))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CollaboratorResponse> findCollaboratorsByAvailability(CollaboratorStatus status) {
        return collaboratorRepository.findAll().stream()
                .filter(c -> c.getStatus() == status)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth's radius in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public CollaboratorResponse mapToResponse(CollaboratorEntity entity) {
        List<Long> serviceAreaIds = entity.getServiceAreas().stream()
                .map(assoc -> assoc.getServiceArea().getId())
                .collect(Collectors.toList());

        return new CollaboratorResponse(
                entity.getId(),
                entity.getName(),
                entity.getContactPerson(),
                entity.getEmail(),
                entity.getPhoneNumber(),
                entity.getAddress(),
                entity.getStatus(),
                entity.getContractExpiryDate(),
                entity.getNotes(),
                entity.getLatitude(),
                entity.getLongitude(),
                serviceAreaIds
        );
    }
}
