package com.nexfuel.analytics.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderAnalyticsResponse {
    private Long totalOrders;
    private Long completedOrders;
    private Long cancelledOrders;
    private Double completionRate;
    private Double cancellationRate;
}
