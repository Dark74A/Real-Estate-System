package com.gharwale.controller;

import com.gharwale.dto.*;
import com.gharwale.service.AgentService;
import com.gharwale.service.ListingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/agents")
@RequiredArgsConstructor
public class AgentController {

    private final AgentService agentService;
    private final ListingService listingService;

    @GetMapping
    public ResponseEntity<List<AgentDTO>> getAll() {
        return ResponseEntity.ok(agentService.getAllAgents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgentDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(agentService.getAgentById(id));
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody AgentCreateRequest req) {
        try {
            return ResponseEntity.ok(agentService.createAgent(req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id,
                                    @Valid @RequestBody AgentCreateRequest req) {
        try {
            return ResponseEntity.ok(agentService.updateAgent(id, req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        try {
            agentService.deleteAgent(id);
            return ResponseEntity.ok("Agent deleted");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> setStatus(@PathVariable Integer id,
                                       @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(agentService.setStatus(id, body.get("status")));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}/employment-history")
    public ResponseEntity<List<EmploymentHistoryDTO>> getEmploymentHistory(@PathVariable Integer id) {
        return ResponseEntity.ok(agentService.getEmploymentHistory(id));
    }

    @GetMapping("/{id}/listings")
    public ResponseEntity<?> getListingsByAgent(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(listingService.getByAgent(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
