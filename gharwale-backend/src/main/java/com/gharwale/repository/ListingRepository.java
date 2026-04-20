package com.gharwale.repository;

import com.gharwale.entity.Listing;
import com.gharwale.entity.ListingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ListingRepository extends JpaRepository<Listing, Integer> {
    List<Listing> findByStatus(ListingStatus status);
    List<Listing> findByOwnerId(Integer ownerId);

    @Query("SELECT l FROM Listing l WHERE l.unit.building.city LIKE %:city%")
    List<Listing> findByCity(@Param("city") String city);

    @Query("SELECT l FROM Listing l JOIN AgentAssignment aa ON aa.listingId = l.listingId WHERE aa.agentId = :agentId")
    List<Listing> findByAgentId(@Param("agentId") Integer agentId);
}
