package com.nexfuel.tracking.service;

import com.nexfuel.tracking.document.OrderTrackingDocument;
import com.nexfuel.tracking.dto.TrackingDashboardResponse;
import com.nexfuel.tracking.repository.NotificationRepository;
import com.nexfuel.tracking.repository.OrderTrackingRepository;
import com.nexfuel.tracking.repository.ProviderLocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TrackingDashboardService {

    private final ProviderLocationRepository locationRepository;
    private final OrderTrackingRepository trackingRepository;
    private final NotificationRepository notificationRepository;

    public TrackingDashboardResponse getDashboardData() {
        long activeProviders = locationRepository.findByStatus("AVAILABLE").size();
        
        List<OrderTrackingDocument> activeTrackings = trackingRepository.findAll().stream()
                .filter(doc -> "EN_ROUTE".equals(doc.getStatus()) || "ARRIVED".equals(doc.getStatus()) || "DELIVERING".equals(doc.getStatus()))
                .collect(java.util.stream.Collectors.toList());

        long enRouteOrders = activeTrackings.size();
        
        double avgEta = activeTrackings.stream()
                .mapToInt(OrderTrackingDocument::getEtaMinutes)
                .average()
                .orElse(0.0);

        long unreadAlerts = notificationRepository.findAll().stream()
                .filter(doc -> !doc.getRead())
                .count();

        return TrackingDashboardResponse.builder()
                .totalActiveProviders(activeProviders)
                .totalEnRouteOrders(enRouteOrders)
                .averageEtaMinutes(avgEta)
                .unreadNotificationsCount(unreadAlerts)
                .build();
    }
}
