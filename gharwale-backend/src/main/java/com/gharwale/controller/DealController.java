package com.gharwale.controller;

import com.gharwale.dto.*;
import com.gharwale.service.DealService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/deals")
@RequiredArgsConstructor
public class DealController {

    private final DealService dealService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllDeals() {
        Map<String, Object> result = new HashMap<>();
        result.put("sales",   dealService.getAllSales());
        result.put("rentals", dealService.getAllRentals());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/sale")
    public ResponseEntity<?> closeSale(@RequestBody SaleDealRequest req) {
        try {
            return ResponseEntity.ok(dealService.closeSale(req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/rent")
    public ResponseEntity<?> closeRental(@RequestBody RentalDealRequest req) {
        try {
            return ResponseEntity.ok(dealService.closeRental(req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/agent/{agentId}")
    public ResponseEntity<Map<String, Object>> getDealsByAgent(@PathVariable Integer agentId) {
        Map<String, Object> result = new HashMap<>();
        result.put("sales",   dealService.getSalesByAgent(agentId));
        result.put("rentals", dealService.getRentalsByAgent(agentId));
        return ResponseEntity.ok(result);
    }
}
