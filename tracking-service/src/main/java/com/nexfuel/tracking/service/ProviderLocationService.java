package com.nexfuel.tracking.service;

import com.nexfuel.shared.exception.BaseException;
import com.nexfuel.shared.exception.ErrorCode;
import com.nexfuel.tracking.document.ProviderLocationDocument;
import com.nexfuel.tracking.dto.ProviderLocationRequest;
import com.nexfuel.tracking.dto.ProviderLocationResponse;
import com.nexfuel.tracking.exception.ProviderLocationNotFoundException;
import com.nexfuel.tracking.repository.ProviderLocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProviderLocationService {

    private final ProviderLocationRepository locationRepository;

    public ProviderLocationResponse updateLocation(ProviderLocationRequest request) {
        // Business Rule: Only AVAILABLE (or ON_JOB) providers can update location
        String status = request.getStatus().toUpperCase();
        if (!"AVAILABLE".equals(status) && !"ON_JOB".equals(status)) {
            throw new BaseException(ErrorCode.BAD_REQUEST, "Provider must be ACTIVE (AVAILABLE or ON_JOB) to update location.");
        }

        ProviderLocationDocument doc = locationRepository.findByProviderId(request.getProviderId())
                .orElse(new ProviderLocationDocument());

        doc.setProviderId(request.getProviderId());
        doc.setLatitude(request.getLatitude());
        doc.setLongitude(request.getLongitude());
        doc.setStatus(status);
        doc.setLastUpdated(LocalDateTime.now());

        ProviderLocationDocument saved = locationRepository.save(doc);
        return mapToResponse(saved);
    }

    public ProviderLocationResponse getProviderLocation(Long providerId) {
        ProviderLocationDocument doc = locationRepository.findByProviderId(providerId)
                .orElseThrow(() -> new ProviderLocationNotFoundException("No tracking location record found for provider ID: " + providerId));
        return mapToResponse(doc);
    }

    public List<ProviderLocationResponse> getNearestProviders(Double latitude, Double longitude, Double radiusKm) {
        List<ProviderLocationDocument> availableProviders = locationRepository.findByStatus("AVAILABLE");
        
        return availableProviders.stream()
                .filter(prov -> calculateDistance(latitude, longitude, prov.getLatitude(), prov.getLongitude()) <= radiusKm)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Haversine Distance Formula
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public ProviderLocationResponse mapToResponse(ProviderLocationDocument doc) {
        return ProviderLocationResponse.builder()
                .providerId(doc.getProviderId())
                .latitude(doc.getLatitude())
                .longitude(doc.getLongitude())
                .status(doc.getStatus())
                .lastUpdated(doc.getLastUpdated())
                .build();
    }
}
