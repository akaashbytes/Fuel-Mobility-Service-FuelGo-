package com.nexfuel.tracking.dto;

import com.nexfuel.tracking.document.OrderTrackingDocument.LocationHistory;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderTrackingResponse {
    private Long orderId;
    private Long providerId;
    private Long customerId;
    private String status;
    private Integer etaMinutes;
    private Double distanceKm;
    private List<LocationHistory> locationTimeline;
    private LocalDateTime lastUpdated;
}
