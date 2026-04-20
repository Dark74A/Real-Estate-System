package com.gharwale.service;

import com.gharwale.dto.*;
import com.gharwale.entity.*;
import com.gharwale.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BuildingService {

    private final BuildingRepository buildingRepo;
    private final UnitDetailsRepository unitRepo;

    public List<BuildingDTO> getAllBuildings() {
        return buildingRepo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public BuildingDTO getBuildingById(Integer id) {
        return toDTO(buildingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Building not found: " + id)));
    }

    @Transactional
    public BuildingDTO createBuilding(BuildingDTO req) {
        Building b = Building.builder()
                .buildingName(req.getBuildingName())
                .buildingNumber(req.getBuildingNumber())
                .locality(req.getLocality())
                .city(req.getCity())
                .pincode(req.getPincode())
                .buildingType(BuildingType.valueOf(req.getBuildingType()))
                .yearOfConstruction(req.getYearOfConstruction())
                .build();
        return toDTO(buildingRepo.save(b));
    }

    @Transactional
    public BuildingDTO updateBuilding(Integer id, BuildingDTO req) {
        Building b = buildingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Building not found: " + id));
        b.setBuildingName(req.getBuildingName());
        b.setBuildingNumber(req.getBuildingNumber());
        b.setLocality(req.getLocality());
        b.setCity(req.getCity());
        b.setPincode(req.getPincode());
        b.setBuildingType(BuildingType.valueOf(req.getBuildingType()));
        b.setYearOfConstruction(req.getYearOfConstruction());
        return toDTO(buildingRepo.save(b));
    }

    @Transactional
    public void deleteBuilding(Integer id) {
        buildingRepo.deleteById(id);
    }

    // ── Units ─────────────────────────────────────────────────────────────────
    public List<UnitDetailsDTO> getUnits(Integer propertyId) {
        return unitRepo.findByPropertyId(propertyId).stream()
                .map(this::toUnitDTO).collect(Collectors.toList());
    }

    @Transactional
    public UnitDetailsDTO addUnit(Integer propertyId, UnitDetailsDTO req) {
        UnitDetails u = UnitDetails.builder()
                .propertyId(propertyId)
                .unitNumber(req.getUnitNumber())
                .bedrooms(req.getBedrooms())
                .bathrooms(req.getBathrooms())
                .carpetArea(req.getCarpetArea())
                .area(req.getArea())
                .kitchen(req.getKitchen() != null ? req.getKitchen() : 1)
                .facing(Facing.valueOf(req.getFacing().replace("-", "")))
                .floor(req.getFloor())
                .build();
        return toUnitDTO(unitRepo.save(u));
    }

    // ── Mappers ───────────────────────────────────────────────────────────────
    public BuildingDTO toDTO(Building b) {
        return BuildingDTO.builder()
                .propertyId(b.getPropertyId())
                .buildingName(b.getBuildingName())
                .buildingNumber(b.getBuildingNumber())
                .locality(b.getLocality())
                .city(b.getCity())
                .pincode(b.getPincode())
                .buildingType(b.getBuildingType().name())
                .yearOfConstruction(b.getYearOfConstruction())
                .build();
    }

    public UnitDetailsDTO toUnitDTO(UnitDetails u) {
        return UnitDetailsDTO.builder()
                .propertyId(u.getPropertyId())
                .unitNumber(u.getUnitNumber())
                .bedrooms(u.getBedrooms())
                .bathrooms(u.getBathrooms())
                .carpetArea(u.getCarpetArea())
                .area(u.getArea())
                .kitchen(u.getKitchen())
                .facing(u.getFacing().name())
                .floor(u.getFloor())
                .build();
    }
}
