package com.nexfuel.feedback.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProviderRatingSummary {
    private Long providerId;
    private Double averageRating;
    private Long totalReviews;
}
