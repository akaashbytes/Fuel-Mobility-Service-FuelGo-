package com.nexfuel.feedback.service;

import com.nexfuel.feedback.dto.AdminFeedbackDashboard;
import com.nexfuel.feedback.entity.FeedbackEntity;
import com.nexfuel.feedback.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackDashboardService {

    private final FeedbackRepository feedbackRepository;

    public AdminFeedbackDashboard getDashboardData() {
        List<FeedbackEntity> allFeedback = feedbackRepository.findAll();
        
        long totalFeedbackCount = allFeedback.size();
        
        double avgSystemRating = allFeedback.stream()
                .mapToInt(FeedbackEntity::getRating)
                .average()
                .orElse(0.0);
        
        long pendingResponsesCount = feedbackRepository.countPendingFeedbackResponses();

        return AdminFeedbackDashboard.builder()
                .totalFeedbackCount(totalFeedbackCount)
                .averageSystemRating(avgSystemRating)
                .pendingResponsesCount(pendingResponsesCount)
                .build();
    }
}
