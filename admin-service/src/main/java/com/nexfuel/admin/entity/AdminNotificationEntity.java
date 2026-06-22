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
@Table(name = "ADMIN_NOTIFICATIONS")
public class AdminNotificationEntity extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "admin_notifications_gen")
    @SequenceGenerator(name = "admin_notifications_gen", sequenceName = "admin_notifications_seq", allocationSize = 1)
    private Long id;

    @NotNull
    @Size(max = 150)
    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @NotNull
    @Size(max = 1000)
    @Column(name = "message", nullable = false, length = 1000)
    private String message;

    @NotNull
    @Column(name = "read_status", nullable = false)
    private Boolean readStatus = false;

    @Size(max = 50)
    @Column(name = "notification_type", length = 50)
    private String notificationType;
}
