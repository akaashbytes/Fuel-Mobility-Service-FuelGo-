package com.nexfuel.analytics.repository;

import com.nexfuel.analytics.document.SystemActivityLogDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SystemActivityLogRepository extends MongoRepository<SystemActivityLogDocument, String> {
    List<SystemActivityLogDocument> findByUserId(Long userId);
    List<SystemActivityLogDocument> findByActivityType(String activityType);
    List<SystemActivityLogDocument> findTop20ByOrderByTimestampDesc();
}
