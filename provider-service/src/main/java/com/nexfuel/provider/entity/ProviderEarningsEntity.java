package com.nexfuel.provider.entity;

import com.nexfuel.shared.model.AuditModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "PROVIDER_EARNINGS")
@Getter
@Setter
@NoArgsConstructor
public class ProviderEarningsEntity extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_prov_earnings")
    @SequenceGenerator(name = "seq_prov_earnings", sequenceName = "SEQ_PROVIDER_EARNINGS", allocationSize = 1)
    private Long id;

    @NotNull(message = "Provider profile is required")
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PROVIDER_ID", nullable = false, unique = true)
    private ProviderProfileEntity providerProfile;

    @NotNull(message = "Gross amount is required")
    @DecimalMin(value = "0.00", message = "Gross amount cannot be negative")
    @Column(name = "GROSS_AMOUNT", nullable = false, precision = 12, scale = 2)
    private BigDecimal grossAmount = BigDecimal.ZERO;

    @NotNull(message = "Paid amount is required")
    @DecimalMin(value = "0.00", message = "Paid amount cannot be negative")
    @Column(name = "PAID_AMOUNT", nullable = false, precision = 12, scale = 2)
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @NotNull(message = "Pending amount is required")
    @DecimalMin(value = "0.00", message = "Pending amount cannot be negative")
    @Column(name = "PENDING_AMOUNT", nullable = false, precision = 12, scale = 2)
    private BigDecimal pendingAmount = BigDecimal.ZERO;

    @NotNull(message = "Last updated timestamp is required")
    @Column(name = "LAST_UPDATED_AT", nullable = false)
    private LocalDateTime lastUpdatedAt = LocalDateTime.now();
}
