package com.nexfuel.analytics.service;

import com.nexfuel.analytics.document.AnalyticsSnapshotDocument;
import com.nexfuel.analytics.dto.RevenueAnalyticsResponse;
import com.nexfuel.analytics.repository.AnalyticsSnapshotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RevenueAnalyticsService {

    private final AnalyticsSnapshotRepository snapshotRepository;

    public RevenueAnalyticsResponse getRevenueAnalytics(String snapshotType) {
        List<AnalyticsSnapshotDocument> snapshots = snapshotRepository.findBySnapshotTypeOrderBySnapshotDateDesc(snapshotType.toUpperCase());

        if (snapshots.isEmpty()) {
            return RevenueAnalyticsResponse.builder()
                    .snapshotType(snapshotType)
                    .totalRevenue(BigDecimal.ZERO)
                    .commissionCollected(BigDecimal.ZERO)
                    .revenueGrowthRate(0.0)
                    .build();
        }

        AnalyticsSnapshotDocument latest = snapshots.get(0);
        double growthRate = 0.0;

        if (snapshots.size() > 1) {
            BigDecimal priorRevenue = snapshots.get(1).getTotalRevenue();
            if (priorRevenue.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal diff = latest.getTotalRevenue().subtract(priorRevenue);
                growthRate = diff.multiply(new BigDecimal("100"))
                        .divide(priorRevenue, 2, RoundingMode.HALF_UP)
                        .doubleValue();
            }
        }

        return RevenueAnalyticsResponse.builder()
                .snapshotDate(latest.getSnapshotDate())
                .snapshotType(latest.getSnapshotType())
                .totalRevenue(latest.getTotalRevenue())
                .commissionCollected(latest.getCommissionCollected())
                .revenueGrowthRate(growthRate)
                .build();
    }
}
