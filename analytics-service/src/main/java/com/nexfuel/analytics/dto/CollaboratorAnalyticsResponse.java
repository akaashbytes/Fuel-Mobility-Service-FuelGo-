package com.nexfuel.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class CollaboratorAnalyticsResponse {
    private Long activeCollaboratorsCount;
    private List<FuelPricingTrend> pricingTrends;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FuelPricingTrend {
        private String fuelType;
        private BigDecimal averagePrice;
        private BigDecimal minPrice;
        private BigDecimal maxPrice;
    }
}
