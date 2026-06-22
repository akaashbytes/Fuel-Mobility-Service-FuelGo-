package com.nexfuel.analytics.service;

import com.nexfuel.analytics.dto.CollaboratorAnalyticsResponse;
import com.nexfuel.analytics.dto.CollaboratorAnalyticsResponse.FuelPricingTrend;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CollaboratorAnalyticsService {

    public CollaboratorAnalyticsResponse getCollaboratorAnalytics() {
        List<FuelPricingTrend> trends = new ArrayList<>();
        
        // Mocking fuel pricing trends across bunk stations:
        trends.add(new FuelPricingTrend("PETROL", new BigDecimal("3.45"), new BigDecimal("3.30"), new BigDecimal("3.65")));
        trends.add(new FuelPricingTrend("DIESEL", new BigDecimal("3.12"), new BigDecimal("2.95"), new BigDecimal("3.35")));
        trends.add(new FuelPricingTrend("PREMIUM", new BigDecimal("4.10"), new BigDecimal("3.90"), new BigDecimal("4.35")));

        return CollaboratorAnalyticsResponse.builder()
                .activeCollaboratorsCount(8L) // mock value
                .pricingTrends(trends)
                .build();
    }
}
