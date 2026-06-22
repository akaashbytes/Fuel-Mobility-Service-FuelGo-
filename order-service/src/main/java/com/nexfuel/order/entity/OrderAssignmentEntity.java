package com.nexfuel.order.entity;

import com.nexfuel.shared.model.AuditModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "ORDER_ASSIGNMENTS")
@Getter
@Setter
@NoArgsConstructor
public class OrderAssignmentEntity extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_order_assignments")
    @SequenceGenerator(name = "seq_order_assignments", sequenceName = "SEQ_ORDER_ASSIGNMENTS", allocationSize = 1)
    private Long id;

    @NotNull(message = "Order is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ORDER_ID", nullable = false)
    private OrderEntity order;

    @NotNull(message = "Provider ID is required")
    @Column(name = "PROVIDER_ID", nullable = false)
    private Long providerId;

    @NotNull(message = "Assignment status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false, length = 20)
    private AssignmentStatus status = AssignmentStatus.PENDING;

    @NotNull(message = "Assigned timestamp is required")
    @Column(name = "ASSIGNED_AT", nullable = false)
    private LocalDateTime assignedAt = LocalDateTime.now();

    @Column(name = "RESPONDED_AT")
    private LocalDateTime respondedAt;
}
