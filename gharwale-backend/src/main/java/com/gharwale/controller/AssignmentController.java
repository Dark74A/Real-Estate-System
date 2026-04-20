package com.gharwale.controller;

import com.gharwale.dto.AssignmentRequest;
import com.gharwale.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    @PostMapping
    public ResponseEntity<?> assign(@RequestBody AssignmentRequest req) {
        try {
            assignmentService.assign(req);
            return ResponseEntity.ok("Agent assigned successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{agentId}/{listingId}")
    public ResponseEntity<?> unassign(@PathVariable Integer agentId,
                                      @PathVariable Integer listingId) {
        try {
            assignmentService.unassign(agentId, listingId);
            return ResponseEntity.ok("Assignment removed");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
