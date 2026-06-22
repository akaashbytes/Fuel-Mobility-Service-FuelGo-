package com.nexfuel.tracking.document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "order_tracking")
public class OrderTrackingDocument {
    @Id
    private String id;

    @Indexed(unique = true)
    private Long orderId;

    private Long providerId;
    private Long customerId;
    private String status;
    private Integer etaMinutes;
    private Double distanceKm;
    private List<LocationHistory> locationTimeline = new ArrayList<>();
    private LocalDateTime lastUpdated;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LocationHistory {
        private Double latitude;
        private Double longitude;
        private LocalDateTime timestamp;
    }
}
