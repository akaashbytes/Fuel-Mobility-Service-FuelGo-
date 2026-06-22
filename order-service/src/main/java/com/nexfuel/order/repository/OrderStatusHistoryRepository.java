package com.nexfuel.order.repository;

import com.nexfuel.order.entity.OrderStatusHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderStatusHistoryRepository extends JpaRepository<OrderStatusHistoryEntity, Long> {
    List<OrderStatusHistoryEntity> findByOrderIdOrderByCreatedAtDesc(Long orderId);
}
