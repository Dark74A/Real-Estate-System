package com.gharwale.controller;

import com.gharwale.dto.*;
import com.gharwale.service.ListingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/listings")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService listingService;

    @GetMapping
    public ResponseEntity<List<ListingDTO>> getAll(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(listingService.getAllListings(city, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListingDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(listingService.getById(id));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ListingCreateRequest req) {
        try {
            return ResponseEntity.ok(listingService.createListing(req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id,
                                    @RequestBody ListingCreateRequest req) {
        try {
            return ResponseEntity.ok(listingService.updateListing(id, req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        try {
            listingService.deleteListing(id);
            return ResponseEntity.ok("Listing deleted");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
