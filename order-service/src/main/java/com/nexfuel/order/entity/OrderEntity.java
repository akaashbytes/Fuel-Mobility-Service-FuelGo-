package com.nexfuel.order.entity;

import com.nexfuel.shared.model.AuditModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ORDERS")
@Getter
@Setter
@NoArgsConstructor
public class OrderEntity extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_orders")
    @SequenceGenerator(name = "seq_orders", sequenceName = "SEQ_ORDERS", allocationSize = 1)
    private Long id;

    @NotNull(message = "Customer ID is required")
    @Column(name = "CUSTOMER_ID", nullable = false)
    private Long customerId;

    @NotNull(message = "Vehicle ID is required")
    @Column(name = "VEHICLE_ID", nullable = false)
    private Long vehicleId;

    @Column(name = "PROVIDER_ID")
    private Long providerId; // Nullable before pairing

    @NotNull(message = "Order state is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false, length = 20)
    private OrderState status = OrderState.PENDING;

    @NotBlank(message = "Fuel type is required")
    @Size(max = 30)
    @Column(name = "FUEL_TYPE", nullable = false, length = 30)
    private String fuelType; // 87 Regular, 91 Premium, Diesel

    @NotNull(message = "Quantity is required")
    @DecimalMin(value = "0.01", message = "Quantity must be greater than zero")
    @Column(name = "QUANTITY_GALLONS", nullable = false, precision = 6, scale = 2)
    private BigDecimal quantityGallons;

    @NotNull(message = "Delivery charge is required")
    @DecimalMin(value = "0.00", message = "Delivery charge cannot be negative")
    @Column(name = "DELIVERY_CHARGE", nullable = false, precision = 6, scale = 2)
    private BigDecimal deliveryCharge;

    @NotNull(message = "Fuel cost is required")
    @DecimalMin(value = "0.00", message = "Fuel cost cannot be negative")
    @Column(name = "FUEL_COST", nullable = false, precision = 8, scale = 2)
    private BigDecimal fuelCost;

    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.00", message = "Total amount cannot be negative")
    @Column(name = "TOTAL_AMOUNT", nullable = false, precision = 8, scale = 2)
    private BigDecimal totalAmount;

    @NotNull(message = "Target latitude is required")
    @Column(name = "TARGET_LATITUDE", nullable = false, precision = 9, scale = 6)
    private Double targetLatitude;

    @NotNull(message = "Target longitude is required")
    @Column(name = "TARGET_LONGITUDE", nullable = false, precision = 9, scale = 6)
    private Double targetLongitude;

    @NotBlank(message = "Target address is required")
    @Size(max = 255)
    @Column(name = "TARGET_ADDRESS", nullable = false, length = 255)
    private String targetAddress;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderAssignmentEntity> assignments = new ArrayList<>();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderStatusHistoryEntity> statusHistory = new ArrayList<>();

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private OrderOtpVerificationEntity otpVerification;
}
