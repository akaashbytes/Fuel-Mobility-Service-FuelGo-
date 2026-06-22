package com.nexfuel.tracking.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "provider_locations")
public class ProviderLocationDocument {
    @Id
    private String id;

    @Indexed(unique = true)
    private Long providerId;

    private Double latitude;
    private Double longitude;
    private String status;
    private LocalDateTime lastUpdated;
}
