package com.gharwale.repository;

import com.gharwale.entity.AgentAssignment;
import com.gharwale.entity.AgentAssignmentId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AgentAssignmentRepository extends JpaRepository<AgentAssignment, AgentAssignmentId> {
    List<AgentAssignment> findByAgentId(Integer agentId);
    List<AgentAssignment> findByListingId(Integer listingId);
    boolean existsByAgentIdAndListingId(Integer agentId, Integer listingId);
}
