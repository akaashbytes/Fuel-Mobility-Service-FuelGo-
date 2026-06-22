package com.nexfuel.analytics.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Document(collection = "analytics_snapshots")
public class AnalyticsSnapshotDocument {
    @Id
    private String id;

    @Indexed
    private String snapshotType; // DAILY, WEEKLY, MONTHLY

    @Indexed
    private LocalDate snapshotDate;

    private BigDecimal totalRevenue;
    private Long totalOrders;
    private Long completedOrders;
    private Long cancelledOrders;
    private Double averageRating;
    private Long activeProvidersCount;
    private Long activeCustomersCount;
    private BigDecimal commissionCollected;
}
