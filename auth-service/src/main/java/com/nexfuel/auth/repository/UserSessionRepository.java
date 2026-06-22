package com.nexfuel.auth.repository;

import com.nexfuel.auth.entity.UserEntity;
import com.nexfuel.auth.entity.UserSessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSessionEntity, Long> {
    Optional<UserSessionEntity> findByToken(String token);
    List<UserSessionEntity> findByUserAndStatus(UserEntity user, String status);
}
