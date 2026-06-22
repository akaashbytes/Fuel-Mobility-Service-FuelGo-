package com.nexfuel.auth.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ROLE_PERMISSIONS")
@IdClass(RolePermissionId.class)
@Getter
@Setter
@NoArgsConstructor
public class RolePermissionEntity {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ROLE_ID", nullable = false)
    private RoleEntity role;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PERMISSION_ID", nullable = false)
    private PermissionEntity permission;
}
