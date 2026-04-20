package com.gharwale.repository;

import com.gharwale.entity.Agent;
import com.gharwale.entity.AgentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface AgentRepository extends JpaRepository<Agent, Integer> {
    List<Agent> findByAgentStatus(AgentStatus status);

    @Query("SELECT a FROM Agent a WHERE a.person.email = :email")
    Optional<Agent> findByPersonEmail(@Param("email") String email);

    @Query("SELECT a FROM Agent a WHERE a.person.phoneNo = :phone")
    Optional<Agent> findByPersonPhone(@Param("phone") String phone);
}
