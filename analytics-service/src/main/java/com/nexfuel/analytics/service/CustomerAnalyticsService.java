package com.nexfuel.analytics.service;

import com.nexfuel.analytics.dto.CustomerAnalyticsResponse;
import com.nexfuel.analytics.document.AnalyticsSnapshotDocument;
import com.nexfuel.analytics.repository.AnalyticsSnapshotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerAnalyticsService {

    private final AnalyticsSnapshotRepository snapshotRepository;

    public CustomerAnalyticsResponse getCustomerAnalytics() {
        List<AnalyticsSnapshotDocument> snapshots = snapshotRepository.findBySnapshotTypeOrderBySnapshotDateDesc("DAILY");

        long active = 0;
        long newRegs = 0;
        double avgOrders = 0.0;

        if (!snapshots.isEmpty()) {
            AnalyticsSnapshotDocument latest = snapshots.get(0);
            active = latest.getActiveCustomersCount();
            
            // Mock recent additions:
            newRegs = 24L; 
            
            if (active > 0) {
                avgOrders = (double) latest.getCompletedOrders() / active;
                avgOrders = Math.round(avgOrders * 100.0) / 100.0;
            }
        }

        return CustomerAnalyticsResponse.builder()
                .activeCustomers(active)
                .newRegistrations(newRegs)
                .averageOrdersPerCustomer(avgOrders)
                .build();
    }
}
