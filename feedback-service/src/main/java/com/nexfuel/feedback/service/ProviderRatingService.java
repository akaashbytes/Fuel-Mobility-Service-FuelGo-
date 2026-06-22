package com.nexfuel.feedback.service;

import com.nexfuel.feedback.dto.ProviderRatingSummary;
import com.nexfuel.feedback.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProviderRatingService {

    private final FeedbackRepository feedbackRepository;

    public ProviderRatingSummary getProviderRatingSummary(Long providerId) {
        Double avgRating = feedbackRepository.getAverageRatingForProvider(providerId);
        Long totalReviews = feedbackRepository.getRatingCountForProvider(providerId);

        return ProviderRatingSummary.builder()
                .providerId(providerId)
                .averageRating(avgRating)
                .totalReviews(totalReviews)
                .build();
    }
}
