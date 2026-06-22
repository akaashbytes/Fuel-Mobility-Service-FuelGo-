package com.nexfuel.payment.repository;

import com.nexfuel.payment.entity.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {
    Optional<PaymentEntity> findByInvoiceOrderId(Long orderId);
    Optional<PaymentEntity> findByGatewayPaymentId(String gatewayPaymentId);
    
    @Query("SELECT p FROM PaymentEntity p JOIN FETCH p.invoice WHERE p.invoice.orderId IN :orderIds")
    List<PaymentEntity> findAllByOrderIds(@Param("orderIds") List<Long> orderIds);
}
