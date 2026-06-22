package com.nexfuel.order.entity;

import com.nexfuel.shared.model.AuditModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Table(name = "SERVICE_PACKAGES")
@Getter
@Setter
@NoArgsConstructor
public class ServicePackageEntity extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_service_packages")
    @SequenceGenerator(name = "seq_service_packages", sequenceName = "SEQ_SERVICE_AREAS", allocationSize = 1)
    private Long id;

    @NotBlank(message = "Package name is required")
    @Size(max = 50)
    @Column(name = "NAME", nullable = false, length = 50)
    private String name;

    @Size(max = 255)
    @Column(name = "DESCRIPTION", length = 255)
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.00", message = "Price cannot be negative")
    @Column(name = "PRICE", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @NotBlank(message = "Status is required")
    @Size(max = 20)
    @Column(name = "STATUS", nullable = false, length = 20)
    private String status = "ACTIVE"; // ACTIVE, INACTIVE
}
