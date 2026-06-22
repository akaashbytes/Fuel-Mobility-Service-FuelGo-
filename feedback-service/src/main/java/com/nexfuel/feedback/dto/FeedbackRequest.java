package com.nexfuel.feedback.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class FeedbackRequest {
    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotNull(message = "Rating score is required")
    @Min(value = 1, message = "Rating score must be at least 1")
    @Max(value = 5, message = "Rating score must not exceed 5")
    private Integer rating;

    @Size(max = 500, message = "Feedback comment must not exceed 500 characters")
    private String comment;
}
