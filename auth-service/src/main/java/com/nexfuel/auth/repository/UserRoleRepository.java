package com.nexfuel.auth.repository;

import com.nexfuel.auth.entity.UserRoleEntity;
import com.nexfuel.auth.entity.UserRoleId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRoleEntity, UserRoleId> {
}
