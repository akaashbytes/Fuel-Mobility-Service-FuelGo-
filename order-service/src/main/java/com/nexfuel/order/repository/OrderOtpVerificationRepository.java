package com.nexfuel.order.repository;

import com.nexfuel.order.entity.OrderOtpVerificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderOtpVerificationRepository extends JpaRepository<OrderOtpVerificationEntity, Long> {
    Optional<OrderOtpVerificationEntity> findByOrderId(Long orderId);
}
