package com.nexfuel.feedback.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class FeedbackResponse {
    private Long id;
    private Long orderId;
    private Long customerId;
    private Long providerId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
