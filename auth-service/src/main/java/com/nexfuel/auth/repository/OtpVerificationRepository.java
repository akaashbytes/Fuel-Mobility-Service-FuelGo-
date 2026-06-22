package com.nexfuel.auth.repository;

import com.nexfuel.auth.entity.OtpVerificationEntity;
import com.nexfuel.shared.enums.OtpType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerificationEntity, Long> {
    Optional<OtpVerificationEntity> findByUserEmailAndOtpCodeAndVerifyTypeAndStatus(
            String email, String otpCode, OtpType verifyType, String status
    );
    Optional<OtpVerificationEntity> findByUserEmailAndVerifyTypeAndStatus(
            String email, OtpType verifyType, String status
    );
}
