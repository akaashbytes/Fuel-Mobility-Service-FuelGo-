package com.nexfuel.analytics.service;

import com.nexfuel.analytics.dto.ProviderAnalyticsResponse;
import com.nexfuel.analytics.dto.ProviderAnalyticsResponse.TopProviderInfo;
import com.nexfuel.analytics.document.AnalyticsSnapshotDocument;
import com.nexfuel.analytics.repository.AnalyticsSnapshotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProviderAnalyticsService {

    private final AnalyticsSnapshotRepository snapshotRepository;

    public ProviderAnalyticsResponse getProviderAnalytics() {
        List<AnalyticsSnapshotDocument> snapshots = snapshotRepository.findBySnapshotTypeOrderBySnapshotDateDesc("DAILY");

        long active = 0;
        double avgRating = 0.0;
        List<TopProviderInfo> topList = new ArrayList<>();

        if (!snapshots.isEmpty()) {
            AnalyticsSnapshotDocument latest = snapshots.get(0);
            active = latest.getActiveProvidersCount();
            avgRating = latest.getAverageRating();
            
            // Mock Top Providers calculations:
            topList.add(new TopProviderInfo(101L, 4.9, 120L));
            topList.add(new TopProviderInfo(102L, 4.8, 98L));
            topList.add(new TopProviderInfo(103L, 4.75, 85L));
        }

        return ProviderAnalyticsResponse.builder()
                .activeProviders(active)
                .averageRating(avgRating)
                .topPerformers(topList)
                .build();
    }
}
