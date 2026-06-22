package com.nexfuel.order.repository;

import com.nexfuel.order.entity.AssignmentStatus;
import com.nexfuel.order.entity.OrderAssignmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderAssignmentRepository extends JpaRepository<OrderAssignmentEntity, Long> {
    List<OrderAssignmentEntity> findByOrderId(Long orderId);
    List<OrderAssignmentEntity> findByProviderIdAndStatus(Long providerId, AssignmentStatus status);
}
