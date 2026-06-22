package com.nexfuel.provider.service;

import com.nexfuel.provider.dto.*;
import com.nexfuel.provider.entity.*;
import com.nexfuel.provider.exception.ProviderNotFoundException;
import com.nexfuel.provider.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProviderDashboardService {

    private final ProviderProfileRepository providerProfileRepository;
    private final ProviderAvailabilityService providerAvailabilityService;
    private final ProviderEarningsService providerEarningsService;
    private final ProviderDocumentRepository providerDocumentRepository;
    private final ProviderProfileService providerProfileService;

    @Transactional(readOnly = true)
    public ProviderDashboardResponse getDashboardData(Long userId) {
        ProviderProfileEntity profile = providerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ProviderNotFoundException("Provider profile not found for user: " + userId));

        ProviderProfileResponse profileResp = providerProfileService.mapToResponse(profile);
        ProviderAvailabilityResponse availabilityResp = providerAvailabilityService.getCurrentAvailability(userId);
        ProviderEarningsResponse earningsResp = providerEarningsService.getEarningsByUserId(userId);

        List<ProviderDocumentEntity> documents = providerDocumentRepository.findByProviderProfileId(profile.getId());
        long totalDocs = documents.size();
        long approvedDocs = documents.stream()
                .filter(doc -> doc.getStatus() == DocumentStatus.APPROVED)
                .count();

        return new ProviderDashboardResponse(
                profileResp,
                availabilityResp,
                earningsResp,
                totalDocs,
                approvedDocs
        );
    }
}
