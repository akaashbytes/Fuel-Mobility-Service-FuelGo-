package com.nexfuel.collaborator.service;

import com.nexfuel.collaborator.dto.CollaboratorFuelPricingRequest;
import com.nexfuel.collaborator.dto.CollaboratorFuelPricingResponse;
import com.nexfuel.collaborator.entity.*;
import com.nexfuel.collaborator.exception.*;
import com.nexfuel.collaborator.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FuelPricingService {

    private final CollaboratorFuelPricingRepository collaboratorFuelPricingRepository;
    private final CollaboratorRepository collaboratorRepository;

    private static final List<String> VALID_FUEL_TYPES = Arrays.asList("87 Regular", "91 Premium", "Diesel");

    @Transactional
    public CollaboratorFuelPricingResponse addOrUpdatePricing(Long collaboratorId, CollaboratorFuelPricingRequest request) {
        CollaboratorEntity collaborator = collaboratorRepository.findById(collaboratorId)
                .orElseThrow(() -> new CollaboratorNotFoundException("Collaborator not found with ID: " + collaboratorId));

        // Business Rule: Only ACTIVE collaborators can supply fuel / have pricing updated
        if (collaborator.getStatus() != CollaboratorStatus.ACTIVE_PARTNER) {
            throw new CollaboratorValidationException("Cannot modify pricing. Collaborator status is currently " + collaborator.getStatus() + " and must be ACTIVE_PARTNER.");
        }

        // Validate Fuel Type
        if (!VALID_FUEL_TYPES.contains(request.getFuelType())) {
            throw new CollaboratorValidationException("Invalid fuel type. Allowed types are: " + VALID_FUEL_TYPES);
        }

        CollaboratorFuelPricingEntity pricing = collaboratorFuelPricingRepository
                .findByCollaboratorIdAndFuelType(collaboratorId, request.getFuelType())
                .orElseGet(() -> {
                    CollaboratorFuelPricingEntity newPricing = new CollaboratorFuelPricingEntity();
                    newPricing.setCollaborator(collaborator);
                    newPricing.setFuelType(request.getFuelType());
                    return newPricing;
                });

        pricing.setPrice(request.getPrice());
        pricing.setLastUpdatedAt(LocalDateTime.now());

        CollaboratorFuelPricingEntity saved = collaboratorFuelPricingRepository.save(pricing);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<CollaboratorFuelPricingResponse> getPricingByCollaboratorId(Long collaboratorId) {
        if (!collaboratorRepository.existsById(collaboratorId)) {
            throw new CollaboratorNotFoundException("Collaborator not found with ID: " + collaboratorId);
        }

        return collaboratorFuelPricingRepository.findByCollaboratorId(collaboratorId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CollaboratorFuelPricingResponse mapToResponse(CollaboratorFuelPricingEntity entity) {
        return new CollaboratorFuelPricingResponse(
                entity.getId(),
                entity.getCollaborator().getId(),
                entity.getFuelType(),
                entity.getPrice(),
                entity.getLastUpdatedAt()
        );
    }
}
