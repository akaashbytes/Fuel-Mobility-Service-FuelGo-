package com.nexfuel.provider.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProviderEarningsResponse {
    private Long id;
    private Long providerId;
    private BigDecimal grossAmount;
    private BigDecimal paidAmount;
    private BigDecimal pendingAmount;
    private LocalDateTime lastUpdatedAt;
}
