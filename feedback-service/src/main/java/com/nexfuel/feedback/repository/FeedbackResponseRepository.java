package com.nexfuel.feedback.repository;

import com.nexfuel.feedback.entity.FeedbackResponseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackResponseRepository extends JpaRepository<FeedbackResponseEntity, Long> {
    List<FeedbackResponseEntity> findByFeedbackId(Long feedbackId);
}
