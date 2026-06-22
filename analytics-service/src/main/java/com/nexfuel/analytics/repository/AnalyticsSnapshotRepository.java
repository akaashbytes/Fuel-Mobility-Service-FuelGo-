package com.nexfuel.analytics.repository;

import com.nexfuel.analytics.document.AnalyticsSnapshotDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AnalyticsSnapshotRepository extends MongoRepository<AnalyticsSnapshotDocument, String> {
    Optional<AnalyticsSnapshotDocument> findBySnapshotTypeAndSnapshotDate(String snapshotType, LocalDate snapshotDate);
    List<AnalyticsSnapshotDocument> findBySnapshotTypeOrderBySnapshotDateDesc(String snapshotType);
}
