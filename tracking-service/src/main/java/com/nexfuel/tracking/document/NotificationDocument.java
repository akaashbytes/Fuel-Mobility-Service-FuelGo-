package com.nexfuel.tracking.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "notifications")
public class NotificationDocument {
    @Id
    private String id;

    @Indexed
    private Long userId;

    private String userRole;
    private String title;
    private String message;
    private Boolean read;
    private LocalDateTime createdAt;
}
