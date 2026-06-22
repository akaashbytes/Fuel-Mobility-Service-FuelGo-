package com.nexfuel.analytics.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class RevenueAnalyticsResponse {
    private LocalDate snapshotDate;
    private String snapshotType;
    private BigDecimal totalRevenue;
    private BigDecimal commissionCollected;
    private Double revenueGrowthRate;
}
