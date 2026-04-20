package com.gharwale.repository;

import com.gharwale.entity.EmploymentHistory;
import com.gharwale.entity.EmploymentHistoryId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EmploymentHistoryRepository extends JpaRepository<EmploymentHistory, EmploymentHistoryId> {
    List<EmploymentHistory> findByAgentIdOrderByDateOfJoiningDesc(Integer agentId);
}
