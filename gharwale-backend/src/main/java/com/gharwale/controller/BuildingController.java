package com.gharwale.controller;

import com.gharwale.dto.*;
import com.gharwale.service.BuildingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/buildings")
@RequiredArgsConstructor
public class BuildingController {

    private final BuildingService buildingService;

    @GetMapping
    public ResponseEntity<List<BuildingDTO>> getAll() {
        return ResponseEntity.ok(buildingService.getAllBuildings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BuildingDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(buildingService.getBuildingById(id));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody BuildingDTO req) {
        try {
            return ResponseEntity.ok(buildingService.createBuilding(req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody BuildingDTO req) {
        try {
            return ResponseEntity.ok(buildingService.updateBuilding(id, req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        try {
            buildingService.deleteBuilding(id);
            return ResponseEntity.ok("Building deleted");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}/units")
    public ResponseEntity<List<UnitDetailsDTO>> getUnits(@PathVariable Integer id) {
        return ResponseEntity.ok(buildingService.getUnits(id));
    }

    @PostMapping("/{id}/units")
    public ResponseEntity<?> addUnit(@PathVariable Integer id, @RequestBody UnitDetailsDTO req) {
        try {
            return ResponseEntity.ok(buildingService.addUnit(id, req));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
