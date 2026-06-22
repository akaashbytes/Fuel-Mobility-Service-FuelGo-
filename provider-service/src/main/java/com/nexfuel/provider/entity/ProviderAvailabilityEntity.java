package com.nexfuel.provider.entity;

import com.nexfuel.shared.model.AuditModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "PROVIDER_AVAILABILITY")
@Getter
@Setter
@NoArgsConstructor
public class ProviderAvailabilityEntity extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_prov_avail")
    @SequenceGenerator(name = "seq_prov_avail", sequenceName = "SEQ_PROVIDER_AVAILABILITY", allocationSize = 1)
    private Long id;

    @NotNull(message = "Provider profile is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PROVIDER_ID", nullable = false)
    private ProviderProfileEntity providerProfile;

    @NotNull(message = "Availability status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false, length = 20)
    private AvailabilityStatus status;

    @NotNull(message = "Last active timestamp is required")
    @Column(name = "LAST_ACTIVE_AT", nullable = false)
    private LocalDateTime lastActiveAt = LocalDateTime.now();
}
