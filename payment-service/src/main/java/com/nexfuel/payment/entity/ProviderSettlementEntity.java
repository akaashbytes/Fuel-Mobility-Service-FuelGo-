package com.nexfuel.payment.entity;

import com.nexfuel.shared.model.AuditModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "PROVIDER_SETTLEMENTS")
public class ProviderSettlementEntity extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "settlements_gen")
    @SequenceGenerator(name = "settlements_gen", sequenceName = "provider_settlements_seq", allocationSize = 1)
    private Long id;

    @NotNull
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id", nullable = false, unique = true)
    private PaymentEntity payment;

    @NotNull
    @Column(name = "provider_id", nullable = false)
    private Long providerId;

    @NotNull
    @DecimalMin("0.00")
    @Column(name = "gross_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal grossAmount;

    @NotNull
    @DecimalMin("0.00")
    @Column(name = "commission_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal commissionAmount;

    @NotNull
    @DecimalMin("0.00")
    @Column(name = "settlement_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal settlementAmount;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private SettlementStatus status;

    @Column(name = "settled_at")
    private LocalDateTime settledAt;
}
