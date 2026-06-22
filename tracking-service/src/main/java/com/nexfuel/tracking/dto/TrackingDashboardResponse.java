package com.nexfuel.tracking.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TrackingDashboardResponse {
    private Long totalActiveProviders;
    private Long totalEnRouteOrders;
    private Double averageEtaMinutes;
    private Long unreadNotificationsCount;
}
