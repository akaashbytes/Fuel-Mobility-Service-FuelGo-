package com.nexfuel.feedback.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class FeedbackDetailResponse {
    private Long id;
    private Long orderId;
    private Long customerId;
    private Long providerId;
    private Integer rating;
    private String comment;
    private List<FeedbackResponseDto> responses;
    private LocalDateTime createdAt;
}
