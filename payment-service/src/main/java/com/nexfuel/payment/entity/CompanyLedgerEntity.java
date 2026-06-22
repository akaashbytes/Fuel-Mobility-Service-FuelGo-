package com.nexfuel.payment.entity;

import com.nexfuel.shared.model.AuditModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "COMPANY_LEDGER")
public class CompanyLedgerEntity extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ledger_gen")
    @SequenceGenerator(name = "ledger_gen", sequenceName = "company_ledger_seq", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id")
    private PaymentEntity payment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "settlement_id")
    private ProviderSettlementEntity settlement;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "entry_type", nullable = false, length = 20)
    private LedgerEntryType entryType;

    @NotNull
    @DecimalMin("0.00")
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "purpose", nullable = false, length = 30)
    private LedgerPurpose purpose;

    @Size(max = 255)
    @Column(name = "description", length = 255)
    private String description;
}
