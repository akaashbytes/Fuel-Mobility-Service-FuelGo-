package com.nexfuel.payment.dto;

import com.nexfuel.payment.entity.SettlementStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ProviderSettlementResponse {
    private Long id;
    private Long paymentId;
    private Long providerId;
    private BigDecimal grossAmount;
    private BigDecimal commissionAmount;
    private BigDecimal settlementAmount;
    private SettlementStatus status;
    private LocalDateTime settledAt;
    private LocalDateTime createdAt;
}
