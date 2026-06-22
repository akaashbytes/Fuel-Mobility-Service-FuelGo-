package com.nexfuel.feedback.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class FeedbackResponseDto {
    private Long id;
    private Long adminId;
    private String responseComment;
    private LocalDateTime createdAt;
}
