package com.nexfuel.provider.dto;

import com.nexfuel.provider.entity.ProviderStatus;
import lombok.Data;

@Data
public class ProviderProfileRequest {
    private ProviderStatus status;
}
