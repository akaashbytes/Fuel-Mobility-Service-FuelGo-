package com.nexfuel.admin.repository;

import com.nexfuel.admin.entity.AdminActionLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminActionLogRepository extends JpaRepository<AdminActionLogEntity, Long> {
    List<AdminActionLogEntity> findAllByOrderByCreatedAtDesc();
}
