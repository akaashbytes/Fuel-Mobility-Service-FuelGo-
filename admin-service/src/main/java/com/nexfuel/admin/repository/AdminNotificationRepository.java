package com.nexfuel.admin.repository;

import com.nexfuel.admin.entity.AdminNotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminNotificationRepository extends JpaRepository<AdminNotificationEntity, Long> {
    List<AdminNotificationEntity> findAllByOrderByCreatedAtDesc();
}
