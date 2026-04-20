package com.gharwale.controller;

import com.gharwale.dto.*;
import com.gharwale.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDTO> getSummary() {
        return ResponseEntity.ok(reportService.getSummary());
    }

    @GetMapping("/agent-performance")
    public ResponseEntity<List<AgentPerformanceDTO>> getAgentPerformance() {
        return ResponseEntity.ok(reportService.getAgentPerformance());
    }
}
