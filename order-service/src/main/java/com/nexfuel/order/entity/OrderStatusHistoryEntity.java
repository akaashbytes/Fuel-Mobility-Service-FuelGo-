package com.nexfuel.order.entity;

import com.nexfuel.shared.model.AuditModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ORDER_STATUS_HISTORY")
@Getter
@Setter
@NoArgsConstructor
public class OrderStatusHistoryEntity extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_order_hist")
    @SequenceGenerator(name = "seq_order_hist", sequenceName = "SEQ_ORDER_STATUS_HISTORY", allocationSize = 1)
    private Long id;

    @NotNull(message = "Order is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ORDER_ID", nullable = false)
    private OrderEntity order;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false, length = 20)
    private OrderState status;

    @NotBlank(message = "Changed by actor label is required")
    @Size(max = 50)
    @Column(name = "CHANGED_BY", nullable = false, length = 50)
    private String changedBy; // CUSTOMER, PROVIDER, ADMIN_ID

    @Size(max = 255)
    @Column(name = "NOTES", length = 255)
    private String notes;
}
