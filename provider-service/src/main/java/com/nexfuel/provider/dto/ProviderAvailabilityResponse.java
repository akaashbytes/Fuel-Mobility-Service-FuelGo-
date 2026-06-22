package com.nexfuel.provider.dto;

import com.nexfuel.provider.entity.AvailabilityStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProviderAvailabilityResponse {
    private Long id;
    private Long providerId;
    private AvailabilityStatus status;
    private LocalDateTime lastActiveAt;
}
