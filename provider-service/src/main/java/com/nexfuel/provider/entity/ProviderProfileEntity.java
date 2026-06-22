package com.nexfuel.provider.entity;

import com.nexfuel.shared.model.AuditModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "PROVIDER_PROFILES")
@Getter
@Setter
@NoArgsConstructor
public class ProviderProfileEntity extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_prov_profiles")
    @SequenceGenerator(name = "seq_prov_profiles", sequenceName = "SEQ_PROVIDER_PROFILES", allocationSize = 1)
    private Long id;

    @NotNull(message = "User ID mapping is required")
    @Column(name = "USER_ID", nullable = false, unique = true)
    private Long userId;

    @NotNull(message = "Provider status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false, length = 20)
    private ProviderStatus status = ProviderStatus.PENDING;

    @DecimalMin(value = "1.00", message = "Rating cannot be less than 1.00")
    @DecimalMax(value = "5.00", message = "Rating cannot exceed 5.00")
    @Column(name = "RATING", nullable = false)
    private double rating = 5.00;

    @Min(value = 0, message = "Completed deliveries cannot be negative")
    @Column(name = "COMPLETED_DELIVERIES", nullable = false)
    private int completedDeliveries = 0;

    @OneToMany(mappedBy = "providerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProviderDocumentEntity> documents = new ArrayList<>();

    @OneToMany(mappedBy = "providerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProviderAvailabilityEntity> availabilities = new ArrayList<>();

    @OneToOne(mappedBy = "providerProfile", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private ProviderEarningsEntity earnings;
}
