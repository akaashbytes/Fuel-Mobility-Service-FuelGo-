package com.nexfuel.analytics.service;

import com.nexfuel.analytics.dto.OrderAnalyticsResponse;
import com.nexfuel.analytics.document.AnalyticsSnapshotDocument;
import com.nexfuel.analytics.repository.AnalyticsSnapshotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderAnalyticsService {

    private final AnalyticsSnapshotRepository snapshotRepository;

    public OrderAnalyticsResponse getOrderAnalytics(String snapshotType) {
        List<AnalyticsSnapshotDocument> snapshots = snapshotRepository.findBySnapshotTypeOrderBySnapshotDateDesc(snapshotType.toUpperCase());

        if (snapshots.isEmpty()) {
            return OrderAnalyticsResponse.builder()
                    .totalOrders(0L)
                    .completedOrders(0L)
                    .cancelledOrders(0L)
                    .completionRate(0.0)
                    .cancellationRate(0.0)
                    .build();
        }

        AnalyticsSnapshotDocument latest = snapshots.get(0);
        long total = latest.getTotalOrders();
        long completed = latest.getCompletedOrders();
        long cancelled = latest.getCancelledOrders();

        double compRate = 0.0;
        double cancRate = 0.0;

        if (total > 0) {
            compRate = ((double) completed / total) * 100.0;
            cancRate = ((double) cancelled / total) * 100.0;
        }

        return OrderAnalyticsResponse.builder()
                .totalOrders(total)
                .completedOrders(completed)
                .cancelledOrders(cancelled)
                .completionRate(Math.round(compRate * 100.0) / 100.0)
                .cancellationRate(Math.round(cancRate * 100.0) / 100.0)
                .build();
    }
}
