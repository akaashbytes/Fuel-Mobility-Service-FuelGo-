package com.nexfuel.customer.entity;

import com.nexfuel.shared.model.AuditModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "CUSTOMER_PROFILES")
@Getter
@Setter
@NoArgsConstructor
public class CustomerProfileEntity extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_cust_profiles")
    @SequenceGenerator(name = "seq_cust_profiles", sequenceName = "SEQ_CUSTOMER_PROFILES", allocationSize = 1)
    private Long id;

    @NotNull(message = "User ID mapping is required")
    @Column(name = "USER_ID", nullable = false, unique = true)
    private Long userId;

    @DecimalMin(value = "1.00", message = "Rating cannot be less than 1.00")
    @DecimalMax(value = "5.00", message = "Rating cannot exceed 5.00")
    @Column(name = "RATING", nullable = false)
    private double rating = 5.00;

    @Size(max = 255, message = "Default address cannot exceed 255 characters")
    @Column(name = "DEFAULT_ADDRESS", length = 255)
    private String defaultAddress;

    @OneToMany(mappedBy = "customerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VehicleEntity> vehicles = new ArrayList<>();
}
