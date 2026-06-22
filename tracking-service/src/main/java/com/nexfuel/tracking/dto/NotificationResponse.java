package com.nexfuel.tracking.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponse {
    private String id;
    private Long userId;
    private String userRole;
    private String title;
    private String message;
    private Boolean read;
    private LocalDateTime createdAt;
}
