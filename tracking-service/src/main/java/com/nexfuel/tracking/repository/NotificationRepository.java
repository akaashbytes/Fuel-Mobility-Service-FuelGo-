package com.nexfuel.tracking.repository;

import com.nexfuel.tracking.document.NotificationDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<NotificationDocument, String> {
    List<NotificationDocument> findByUserId(Long userId);
    List<NotificationDocument> findByUserIdAndRead(Long userId, boolean read);
}
