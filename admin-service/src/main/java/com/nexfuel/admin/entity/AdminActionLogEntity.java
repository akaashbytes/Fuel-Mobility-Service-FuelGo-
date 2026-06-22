package com.nexfuel.admin.entity;

import com.nexfuel.shared.model.AuditModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "ADMIN_ACTION_LOGS")
public class AdminActionLogEntity extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "admin_action_logs_gen")
    @SequenceGenerator(name = "admin_action_logs_gen", sequenceName = "admin_action_logs_seq", allocationSize = 1)
    private Long id;

    @NotNull
    @Column(name = "admin_id", nullable = false)
    private Long adminId;

    @NotNull
    @Size(max = 100)
    @Column(name = "action_type", nullable = false, length = 100)
    private String actionType;

    @Size(max = 2000)
    @Column(name = "details", length = 2000)
    private String details;

    @Size(max = 50)
    @Column(name = "ip_address", length = 50)
    private String ipAddress;
}
