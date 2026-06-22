package com.nexfuel.analytics.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "system_activity_logs")
public class SystemActivityLogDocument {
    @Id
    private String id;

    @Indexed
    private Long userId;

    private String userRole;

    @Indexed
    private String activityType; // e.g. LOGIN, PLACE_ORDER, MAKE_PAYMENT, SUBMIT_FEEDBACK

    private String description;
    private LocalDateTime timestamp;
}
