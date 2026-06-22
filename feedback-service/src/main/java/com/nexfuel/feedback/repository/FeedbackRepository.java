package com.nexfuel.feedback.repository;

import com.nexfuel.feedback.entity.FeedbackEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<FeedbackEntity, Long> {
    Optional<FeedbackEntity> findByOrderId(Long orderId);
    List<FeedbackEntity> findByProviderId(Long providerId);
    List<FeedbackEntity> findByCustomerId(Long customerId);
    boolean existsByOrderId(Long orderId);

    @Query("SELECT COALESCE(AVG(f.rating), 0.0) FROM FeedbackEntity f WHERE f.providerId = :providerId")
    Double getAverageRatingForProvider(@Param("providerId") Long providerId);

    @Query("SELECT COUNT(f) FROM FeedbackEntity f WHERE f.providerId = :providerId")
    Long getRatingCountForProvider(@Param("providerId") Long providerId);

    @Query("SELECT COUNT(f) FROM FeedbackEntity f WHERE f.responses IS EMPTY")
    Long countPendingFeedbackResponses();
}
