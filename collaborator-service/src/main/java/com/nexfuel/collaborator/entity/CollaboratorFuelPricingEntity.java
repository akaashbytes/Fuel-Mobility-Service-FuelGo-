package com.nexfuel.collaborator.entity;

import com.nexfuel.shared.model.AuditModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "COLLABORATOR_FUEL_PRICING")
@Getter
@Setter
@NoArgsConstructor
public class CollaboratorFuelPricingEntity extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_col_pricing")
    @SequenceGenerator(name = "seq_col_pricing", sequenceName = "SEQ_COLLABORATOR_FUEL_PRICING", allocationSize = 1)
    private Long id;

    @NotNull(message = "Collaborator is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "COLLABORATOR_ID", nullable = false)
    private CollaboratorEntity collaborator;

    @NotBlank(message = "Fuel type is required")
    @Size(max = 30, message = "Fuel type cannot exceed 30 characters")
    @Column(name = "FUEL_TYPE", nullable = false, length = 30)
    private String fuelType; // 87 Regular, 91 Premium, Diesel

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.00", message = "Price cannot be negative")
    @Column(name = "PRICE", nullable = false, precision = 5, scale = 2)
    private BigDecimal price;

    @NotNull(message = "Last updated timestamp is required")
    @Column(name = "LAST_UPDATED_AT", nullable = false)
    private LocalDateTime lastUpdatedAt = LocalDateTime.now();
}
