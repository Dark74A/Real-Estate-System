package com.gharwale.repository;

import com.gharwale.entity.RentalDeal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;

public interface RentalDealRepository extends JpaRepository<RentalDeal, Integer> {
    List<RentalDeal> findByAgentId(Integer agentId);

    @Query("SELECT COALESCE(SUM(r.rentPrice), 0) FROM RentalDeal r")
    BigDecimal totalRevenue();

    @Query("SELECT COUNT(r) FROM RentalDeal r WHERE r.agentId = :agentId")
    Long countByAgentId(@Param("agentId") Integer agentId);
}
