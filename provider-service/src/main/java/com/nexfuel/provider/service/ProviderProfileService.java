package com.nexfuel.provider.service;

import com.nexfuel.provider.dto.ProviderProfileRequest;
import com.nexfuel.provider.dto.ProviderProfileResponse;
import com.nexfuel.provider.entity.ProviderProfileEntity;
import com.nexfuel.provider.entity.ProviderStatus;
import com.nexfuel.provider.repository.ProviderProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProviderProfileService {

    private final ProviderProfileRepository providerProfileRepository;

    @Transactional(readOnly = true)
    public ProviderProfileResponse getProfileByUserId(Long userId) {
        ProviderProfileEntity profile = providerProfileRepository.findByUserId(userId)
                .orElseGet(() -> autoCreateProfile(userId));
        return mapToResponse(profile);
    }

    @Transactional
    public ProviderProfileResponse updateProfile(Long userId, ProviderProfileRequest request) {
        ProviderProfileEntity profile = providerProfileRepository.findByUserId(userId)
                .orElseGet(() -> autoCreateProfile(userId));

        if (request.getStatus() != null) {
            profile.setStatus(request.getStatus());
        }
        ProviderProfileEntity updatedProfile = providerProfileRepository.save(profile);
        return mapToResponse(updatedProfile);
    }

    @Transactional
    public ProviderProfileEntity autoCreateProfile(Long userId) {
        ProviderProfileEntity profile = new ProviderProfileEntity();
        profile.setUserId(userId);
        profile.setRating(5.00);
        profile.setStatus(ProviderStatus.PENDING);
        profile.setCompletedDeliveries(0);
        return providerProfileRepository.save(profile);
    }

    public ProviderProfileResponse mapToResponse(ProviderProfileEntity entity) {
        return new ProviderProfileResponse(
                entity.getId(),
                entity.getUserId(),
                entity.getStatus(),
                entity.getRating(),
                entity.getCompletedDeliveries()
        );
    }
}
