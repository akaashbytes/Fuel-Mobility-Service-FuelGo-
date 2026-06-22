package com.nexfuel.payment.dto;

import com.nexfuel.payment.entity.InvoiceStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class InvoiceResponse {
    private Long id;
    private Long orderId;
    private String invoiceNumber;
    private BigDecimal amount;
    private BigDecimal tax;
    private BigDecimal totalAmount;
    private InvoiceStatus status;
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;
}
