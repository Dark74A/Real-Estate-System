package com.gharwale.service;

import com.gharwale.dto.AssignmentRequest;
import com.gharwale.entity.AgentAssignment;
import com.gharwale.repository.AgentAssignmentRepository;
import com.gharwale.repository.AgentRepository;
import com.gharwale.repository.ListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AgentAssignmentRepository assignmentRepo;
    private final AgentRepository agentRepo;
    private final ListingRepository listingRepo;

    @Transactional
    public void assign(AssignmentRequest req) {
        if (!agentRepo.existsById(req.getAgentId()))
            throw new RuntimeException("Agent not found: " + req.getAgentId());
        if (!listingRepo.existsById(req.getListingId()))
            throw new RuntimeException("Listing not found: " + req.getListingId());
        if (assignmentRepo.existsByAgentIdAndListingId(req.getAgentId(), req.getListingId()))
            throw new RuntimeException("Agent already assigned to this listing");

        AgentAssignment aa = AgentAssignment.builder()
                .agentId(req.getAgentId())
                .listingId(req.getListingId())
                .assignmentDate(LocalDate.now())
                .build();
        assignmentRepo.save(aa);
    }

    @Transactional
    public void unassign(Integer agentId, Integer listingId) {
        if (!assignmentRepo.existsByAgentIdAndListingId(agentId, listingId))
            throw new RuntimeException("Assignment not found");
        assignmentRepo.deleteById(new com.gharwale.entity.AgentAssignmentId(agentId, listingId));
    }
}
