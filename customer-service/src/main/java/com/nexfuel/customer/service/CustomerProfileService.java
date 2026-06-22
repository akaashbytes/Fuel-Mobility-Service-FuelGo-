package com.nexfuel.customer.service;

import com.nexfuel.customer.dto.CustomerProfileRequest;
import com.nexfuel.customer.dto.CustomerProfileResponse;
import com.nexfuel.customer.entity.CustomerProfileEntity;
import com.nexfuel.customer.exception.CustomerNotFoundException;
import com.nexfuel.customer.repository.CustomerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomerProfileService {

    private final CustomerProfileRepository customerProfileRepository;

    @Transactional(readOnly = true)
    public CustomerProfileResponse getProfileByUserId(Long userId) {
        CustomerProfileEntity profile = customerProfileRepository.findByUserId(userId)
                .orElseGet(() -> autoCreateProfile(userId)); // Auto-create on first load to prevent orphans
        return mapToResponse(profile);
    }

    @Transactional
    public CustomerProfileResponse updateProfile(Long userId, CustomerProfileRequest request) {
        CustomerProfileEntity profile = customerProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    CustomerProfileEntity newProfile = new CustomerProfileEntity();
                    newProfile.setUserId(userId);
                    return newProfile;
                });

        profile.setDefaultAddress(request.getDefaultAddress());
        CustomerProfileEntity updatedProfile = customerProfileRepository.save(profile);
        return mapToResponse(updatedProfile);
    }

    private CustomerProfileEntity autoCreateProfile(Long userId) {
        CustomerProfileEntity profile = new CustomerProfileEntity();
        profile.setUserId(userId);
        profile.setRating(5.00);
        return customerProfileRepository.save(profile);
    }

    private CustomerProfileResponse mapToResponse(CustomerProfileEntity entity) {
        return new CustomerProfileResponse(
                entity.getId(),
                entity.getUserId(),
                entity.getRating(),
                entity.getDefaultAddress()
        );
    }
}
