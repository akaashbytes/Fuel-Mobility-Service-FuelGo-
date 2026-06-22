package com.nexfuel.provider.dto;

import com.nexfuel.provider.entity.ProviderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProviderProfileResponse {
    private Long id;
    private Long userId;
    private ProviderStatus status;
    private double rating;
    private int completedDeliveries;
}
