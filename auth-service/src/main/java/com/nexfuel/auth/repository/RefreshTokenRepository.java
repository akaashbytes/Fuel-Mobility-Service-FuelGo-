package com.nexfuel.auth.repository;

import com.nexfuel.auth.entity.RefreshTokenEntity;
import com.nexfuel.auth.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshTokenEntity, Long> {
    Optional<RefreshTokenEntity> findByToken(String token);
    Optional<RefreshTokenEntity> findByTokenAndRevokedFalse(String token);
    void deleteByUser(UserEntity user);
}
