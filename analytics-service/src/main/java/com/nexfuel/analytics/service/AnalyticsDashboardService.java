package com.nexfuel.analytics.service;

import com.nexfuel.analytics.document.AnalyticsSnapshotDocument;
import com.nexfuel.analytics.document.SystemActivityLogDocument;
import com.nexfuel.analytics.dto.AnalyticsDashboardResponse;
import com.nexfuel.analytics.dto.AnalyticsDashboardResponse.RecentActivityLog;
import com.nexfuel.analytics.repository.AnalyticsSnapshotRepository;
import com.nexfuel.analytics.repository.SystemActivityLogRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsDashboardService {

    private final AnalyticsSnapshotRepository snapshotRepository;
    private final SystemActivityLogRepository activityLogRepository;

    @PostConstruct
    public void initDemoSnapshots() {
        // Seed default daily snapshot if none exists
        if (snapshotRepository.findBySnapshotTypeOrderBySnapshotDateDesc("DAILY").isEmpty()) {
            AnalyticsSnapshotDocument daily = new AnalyticsSnapshotDocument();
            daily.setSnapshotType("DAILY");
            daily.setSnapshotDate(LocalDate.now());
            daily.setTotalRevenue(new BigDecimal("1250.75"));
            daily.setTotalOrders(45L);
            daily.setCompletedOrders(42L);
            daily.setCancelledOrders(3L);
            daily.setAverageRating(4.82);
            daily.setActiveProvidersCount(15L);
            daily.setActiveCustomersCount(85L);
            daily.setCommissionCollected(new BigDecimal("187.61"));
            snapshotRepository.save(daily);
        }
    }

    @Transactional
    public void recordActivityLog(Long userId, String userRole, String activityType, String description) {
        SystemActivityLogDocument log = new SystemActivityLogDocument();
        log.setUserId(userId);
        log.setUserRole(userRole.toUpperCase());
        log.setActivityType(activityType.toUpperCase());
        log.setDescription(description);
        log.setTimestamp(LocalDateTime.now());
        activityLogRepository.save(log);
    }

    @Transactional
    public void generateSnapshot(String type) {
        String snapshotType = type.toUpperCase();
        AnalyticsSnapshotDocument snap = new AnalyticsSnapshotDocument();
        snap.setSnapshotType(snapshotType);
        snap.setSnapshotDate(LocalDate.now());
        
        // Mock aggregate values derived from system collections
        snap.setTotalRevenue(new BigDecimal("24500.00"));
        snap.setTotalOrders(620L);
        snap.setCompletedOrders(580L);
        snap.setCancelledOrders(40L);
        snap.setAverageRating(4.78);
        snap.setActiveProvidersCount(32L);
        snap.setActiveCustomersCount(410L);
        snap.setCommissionCollected(new BigDecimal("3675.00"));

        snapshotRepository.save(snap);
    }

    public AnalyticsDashboardResponse getDashboardData() {
        List<AnalyticsSnapshotDocument> snapshots = snapshotRepository.findBySnapshotTypeOrderBySnapshotDateDesc("DAILY");
        List<SystemActivityLogDocument> logs = activityLogRepository.findTop20ByOrderByTimestampDesc();

        LocalDate date = LocalDate.now();
        BigDecimal revenue = BigDecimal.ZERO;
        long orders = 0;
        double rating = 0.0;
        long providers = 0;
        long customers = 0;

        if (!snapshots.isEmpty()) {
            AnalyticsSnapshotDocument latest = snapshots.get(0);
            date = latest.getSnapshotDate();
            revenue = latest.getTotalRevenue();
            orders = latest.getTotalOrders();
            rating = latest.getAverageRating();
            providers = latest.getActiveProvidersCount();
            customers = latest.getActiveCustomersCount();
        }

        List<RecentActivityLog> recentLogs = logs.stream()
                .map(l -> new RecentActivityLog(l.getId(), l.getUserId(), l.getUserRole(), l.getActivityType(), l.getDescription(), l.getTimestamp()))
                .collect(Collectors.toList());

        return AnalyticsDashboardResponse.builder()
                .snapshotDate(date)
                .totalRevenue(revenue)
                .totalOrders(orders)
                .averageRating(rating)
                .activeProviders(providers)
                .activeCustomers(customers)
                .recentActivityLogs(recentLogs)
                .build();
    }
}
