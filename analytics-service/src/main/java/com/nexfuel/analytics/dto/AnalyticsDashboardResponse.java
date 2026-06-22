package com.nexfuel.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class AnalyticsDashboardResponse {
    private LocalDate snapshotDate;
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private Double averageRating;
    private Long activeProviders;
    private Long activeCustomers;
    private List<RecentActivityLog> recentActivityLogs;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentActivityLog {
        private String id;
        private Long userId;
        private String userRole;
        private String activityType;
        private String description;
        private LocalDateTime timestamp;
    }
}
