package com.nexfuel.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
public class ProviderAnalyticsResponse {
    private Long activeProviders;
    private Double averageRating;
    private List<TopProviderInfo> topPerformers;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopProviderInfo {
        private Long providerId;
        private Double rating;
        private Long completedOrders;
    }
}
