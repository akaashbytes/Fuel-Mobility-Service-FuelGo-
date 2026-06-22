package com.nexfuel.feedback.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminFeedbackDashboard {
    private Long totalFeedbackCount;
    private Double averageSystemRating;
    private Long pendingResponsesCount;
}
