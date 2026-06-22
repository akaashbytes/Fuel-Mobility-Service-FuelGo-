package com.nexfuel.tracking.service;

import com.nexfuel.tracking.document.OrderTrackingDocument;
import com.nexfuel.tracking.document.OrderTrackingDocument.LocationHistory;
import com.nexfuel.tracking.dto.OrderTrackingResponse;
import com.nexfuel.tracking.exception.OrderTrackingNotFoundException;
import com.nexfuel.tracking.repository.OrderTrackingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class OrderTrackingService {

    private final OrderTrackingRepository trackingRepository;

    @Transactional
    public OrderTrackingResponse startTracking(Long orderId, Long providerId, Long customerId) {
        OrderTrackingDocument doc = trackingRepository.findByOrderId(orderId)
                .orElse(new OrderTrackingDocument());

        doc.setOrderId(orderId);
        doc.setProviderId(providerId);
        doc.setCustomerId(customerId);
        doc.setStatus("PENDING");
        doc.setEtaMinutes(15); 
        doc.setDistanceKm(5.0); 
        doc.setLocationTimeline(new ArrayList<>());
        doc.setLastUpdated(LocalDateTime.now());

        OrderTrackingDocument saved = trackingRepository.save(doc);
        return mapToResponse(saved);
    }

    @Transactional
    public OrderTrackingResponse updateOrderTracking(Long orderId, Double latitude, Double longitude, String status) {
        OrderTrackingDocument doc = trackingRepository.findByOrderId(orderId)
                .orElseThrow(() -> new OrderTrackingNotFoundException("Order tracking record not found for ID: " + orderId));

        doc.setStatus(status.toUpperCase());
        doc.setLastUpdated(LocalDateTime.now());

        // Append to timeline history
        LocationHistory log = new LocationHistory(latitude, longitude, LocalDateTime.now());
        doc.getLocationTimeline().add(log);

        // ETA / Distance calculations (Assume static customer coordinate 12.9716, 77.5946)
        double customerLat = 12.9716;
        double customerLon = 77.5946;
        double dist = calculateDistance(latitude, longitude, customerLat, customerLon);
        doc.setDistanceKm(Math.round(dist * 100.0) / 100.0);

        // Assume average speed 40 km/h: ETA = (Distance / Speed) * 60 minutes
        double eta = (dist / 40.0) * 60.0;
        doc.setEtaMinutes((int) Math.ceil(eta));

        if ("COMPLETED".equals(doc.getStatus())) {
            doc.setEtaMinutes(0);
            doc.setDistanceKm(0.0);
        }

        OrderTrackingDocument saved = trackingRepository.save(doc);
        return mapToResponse(saved);
    }

    public OrderTrackingResponse getOrderTracking(Long orderId) {
        OrderTrackingDocument doc = trackingRepository.findByOrderId(orderId)
                .orElseThrow(() -> new OrderTrackingNotFoundException("Order tracking record not found for ID: " + orderId));
        return mapToResponse(doc);
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public OrderTrackingResponse mapToResponse(OrderTrackingDocument doc) {
        return OrderTrackingResponse.builder()
                .orderId(doc.getOrderId())
                .providerId(doc.getProviderId())
                .customerId(doc.getCustomerId())
                .status(doc.getStatus())
                .etaMinutes(doc.getEtaMinutes())
                .distanceKm(doc.getDistanceKm())
                .locationTimeline(doc.getLocationTimeline())
                .lastUpdated(doc.getLastUpdated())
                .build();
    }
}
