package com.nexfuel.provider.service;

import com.nexfuel.provider.dto.ProviderAvailabilityRequest;
import com.nexfuel.provider.dto.ProviderAvailabilityResponse;
import com.nexfuel.provider.entity.AvailabilityStatus;
import com.nexfuel.provider.entity.ProviderAvailabilityEntity;
import com.nexfuel.provider.entity.ProviderProfileEntity;
import com.nexfuel.provider.entity.ProviderStatus;
import com.nexfuel.provider.exception.ProviderApprovalException;
import com.nexfuel.provider.exception.ProviderNotFoundException;
import com.nexfuel.provider.repository.ProviderAvailabilityRepository;
import com.nexfuel.provider.repository.ProviderProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ProviderAvailabilityService {

    private final ProviderAvailabilityRepository providerAvailabilityRepository;
    private final ProviderProfileRepository providerProfileRepository;

    @Transactional(readOnly = true)
    public ProviderAvailabilityResponse getCurrentAvailability(Long userId) {
        ProviderProfileEntity profile = providerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ProviderNotFoundException("Provider profile not found for user: " + userId));

        ProviderAvailabilityEntity availability = providerAvailabilityRepository
                .findFirstByProviderProfileIdOrderByLastActiveAtDesc(profile.getId())
                .orElseGet(() -> createDefaultAvailability(profile));

        return mapToResponse(availability);
    }

    @Transactional
    public ProviderAvailabilityResponse updateAvailability(Long userId, ProviderAvailabilityRequest request) {
        ProviderProfileEntity profile = providerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ProviderNotFoundException("Provider profile not found for user: " + userId));

        // Business Rule: Only approved providers (status = ACTIVE) can become AVAILABLE
        if (request.getStatus() == AvailabilityStatus.AVAILABLE && profile.getStatus() != ProviderStatus.ACTIVE) {
            throw new ProviderApprovalException("Cannot set availability to AVAILABLE. Provider profile is currently " + profile.getStatus() + " and must be approved (ACTIVE) by Admin.");
        }

        ProviderAvailabilityEntity availability = new ProviderAvailabilityEntity();
        availability.setProviderProfile(profile);
        availability.setStatus(request.getStatus());
        availability.setLastActiveAt(LocalDateTime.now());

        ProviderAvailabilityEntity saved = providerAvailabilityRepository.save(availability);
        return mapToResponse(saved);
    }

    private ProviderAvailabilityEntity createDefaultAvailability(ProviderProfileEntity profile) {
        ProviderAvailabilityEntity availability = new ProviderAvailabilityEntity();
        availability.setProviderProfile(profile);
        availability.setStatus(AvailabilityStatus.UNAVAILABLE);
        availability.setLastActiveAt(LocalDateTime.now());
        return providerAvailabilityRepository.save(availability);
    }

    public ProviderAvailabilityResponse mapToResponse(ProviderAvailabilityEntity entity) {
        return new ProviderAvailabilityResponse(
                entity.getId(),
                entity.getProviderProfile().getId(),
                entity.getStatus(),
                entity.getLastActiveAt()
        );
    }
}
