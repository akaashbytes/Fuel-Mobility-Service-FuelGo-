package com.nexfuel.tracking.repository;

import com.nexfuel.tracking.document.OrderTrackingDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderTrackingRepository extends MongoRepository<OrderTrackingDocument, String> {
    Optional<OrderTrackingDocument> findByOrderId(Long orderId);
    List<OrderTrackingDocument> findByProviderId(Long providerId);
    List<OrderTrackingDocument> findByCustomerId(Long customerId);
}
