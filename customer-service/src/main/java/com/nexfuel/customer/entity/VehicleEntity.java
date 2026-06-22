package com.nexfuel.customer.entity;

import com.nexfuel.shared.model.AuditModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "VEHICLES")
@Getter
@Setter
@NoArgsConstructor
public class VehicleEntity extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_vehicles")
    @SequenceGenerator(name = "seq_vehicles", sequenceName = "SEQ_VEHICLES", allocationSize = 1)
    private Long id;

    @NotNull(message = "Customer profile association is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CUSTOMER_ID", nullable = false)
    private CustomerProfileEntity customerProfile;

    @NotBlank(message = "Vehicle make is required")
    @Size(max = 50, message = "Make cannot exceed 50 characters")
    @Column(name = "MAKE", nullable = false, length = 50)
    private String make;

    @NotBlank(message = "Vehicle model is required")
    @Size(max = 50, message = "Model cannot exceed 50 characters")
    @Column(name = "MODEL", nullable = false, length = 50)
    private String model;

    @Min(value = 1900, message = "Year must be valid")
    @Max(value = 2100, message = "Year must be valid")
    @Column(name = "YEAR_VAL", nullable = false)
    private int year;

    @NotBlank(message = "License plate is required")
    @Size(max = 30, message = "License plate cannot exceed 30 characters")
    @Column(name = "LICENSE_PLATE", nullable = false, unique = true, length = 30)
    private String licensePlate;

    @NotBlank(message = "Fuel type is required")
    @Column(name = "FUEL_TYPE", nullable = false, length = 30)
    private String fuelType; // Regular, Premium, Diesel
}
