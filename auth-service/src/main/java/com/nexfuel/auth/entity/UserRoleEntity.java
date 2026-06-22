package com.nexfuel.auth.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "USER_ROLES")
@IdClass(UserRoleId.class)
@Getter
@Setter
@NoArgsConstructor
public class UserRoleEntity {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private UserEntity user;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ROLE_ID", nullable = false)
    private RoleEntity role;
}
