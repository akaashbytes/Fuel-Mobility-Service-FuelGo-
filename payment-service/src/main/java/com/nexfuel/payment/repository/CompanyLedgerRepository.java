package com.nexfuel.payment.repository;

import com.nexfuel.payment.entity.CompanyLedgerEntity;
import com.nexfuel.payment.entity.LedgerEntryType;
import com.nexfuel.payment.entity.LedgerPurpose;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface CompanyLedgerRepository extends JpaRepository<CompanyLedgerEntity, Long> {
    
    @Query("SELECT COALESCE(SUM(l.amount), 0) FROM CompanyLedgerEntity l WHERE l.entryType = :entryType")
    BigDecimal sumAmountByEntryType(@Param("entryType") LedgerEntryType entryType);

    @Query("SELECT COALESCE(SUM(l.amount), 0) FROM CompanyLedgerEntity l WHERE l.purpose = :purpose")
    BigDecimal sumAmountByPurpose(@Param("purpose") LedgerPurpose purpose);
}
