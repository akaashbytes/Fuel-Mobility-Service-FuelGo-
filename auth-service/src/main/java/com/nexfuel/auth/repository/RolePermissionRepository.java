package com.nexfuel.auth.repository;

import com.nexfuel.auth.entity.RolePermissionEntity;
import com.nexfuel.auth.entity.RolePermissionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermissionEntity, RolePermissionId> {
}
