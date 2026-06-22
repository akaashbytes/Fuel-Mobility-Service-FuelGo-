package com.nexfuel.provider.service;

import com.nexfuel.provider.dto.ProviderEarningsResponse;
import com.nexfuel.provider.entity.ProviderEarningsEntity;
import com.nexfuel.provider.entity.ProviderProfileEntity;
import com.nexfuel.provider.exception.ProviderNotFoundException;
import com.nexfuel.provider.repository.ProviderEarningsRepository;
import com.nexfuel.provider.repository.ProviderProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ProviderEarningsService {

    private final ProviderEarningsRepository providerEarningsRepository;
    private final ProviderProfileRepository providerProfileRepository;

    @Transactional(readOnly = true)
    public ProviderEarningsResponse getEarningsByUserId(Long userId) {
        ProviderProfileEntity profile = providerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ProviderNotFoundException("Provider profile not found for user: " + userId));

        ProviderEarningsEntity earnings = providerEarningsRepository.findByProviderProfileId(profile.getId())
                .orElseGet(() -> createDefaultEarnings(profile));

        return mapToResponse(earnings);
    }

    private ProviderEarningsEntity createDefaultEarnings(ProviderProfileEntity profile) {
        ProviderEarningsEntity earnings = new ProviderEarningsEntity();
        earnings.setProviderProfile(profile);
        earnings.setGrossAmount(BigDecimal.ZERO);
        earnings.setPaidAmount(BigDecimal.ZERO);
        earnings.setPendingAmount(BigDecimal.ZERO);
        earnings.setLastUpdatedAt(LocalDateTime.now());
        return providerEarningsRepository.save(earnings);
    }

    public ProviderEarningsResponse mapToResponse(ProviderEarningsEntity entity) {
        return new ProviderEarningsResponse(
                entity.getId(),
                entity.getProviderProfile().getId(),
                entity.getGrossAmount(),
                entity.getPaidAmount(),
                entity.getPendingAmount(),
                entity.getLastUpdatedAt()
        );
    }
}
