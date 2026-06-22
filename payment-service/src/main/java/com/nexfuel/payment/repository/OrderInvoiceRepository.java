package com.nexfuel.payment.repository;

import com.nexfuel.payment.entity.OrderInvoiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderInvoiceRepository extends JpaRepository<OrderInvoiceEntity, Long> {
    Optional<OrderInvoiceEntity> findByOrderId(Long orderId);
    Optional<OrderInvoiceEntity> findByInvoiceNumber(String invoiceNumber);
    boolean existsByOrderId(Long orderId);
}
