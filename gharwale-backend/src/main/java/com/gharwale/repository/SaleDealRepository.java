package com.gharwale.repository;

import com.gharwale.entity.SaleDeal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;

public interface SaleDealRepository extends JpaRepository<SaleDeal, Integer> {
    List<SaleDeal> findByAgentId(Integer agentId);

    @Query("SELECT COALESCE(SUM(s.salePrice), 0) FROM SaleDeal s")
    BigDecimal totalRevenue();

    @Query("SELECT COUNT(s) FROM SaleDeal s WHERE s.agentId = :agentId")
    Long countByAgentId(@Param("agentId") Integer agentId);
}
