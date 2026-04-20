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
public class DealService {

    private final SaleDealRepository saleRepo;
    private final RentalDealRepository rentalRepo;
    private final ListingRepository listingRepo;
    private final AgentRepository agentRepo;
    private final ListingService listingService;
    private final BuildingRepository buildingRepo;

    @Transactional
    public SaleDealDTO closeSale(SaleDealRequest req) {
        Listing listing = listingRepo.findById(req.getListingId())
                .orElseThrow(() -> new RuntimeException("Listing not found"));
        if (listing.getStatus() != ListingStatus.Open)
            throw new RuntimeException("Listing is not open");

        Person buyer = listingService.resolveOrCreatePerson(
                req.getBuyerPhone(), req.getBuyerEmail(),
                req.getBuyerFirstName(), req.getBuyerMiddleName(), req.getBuyerLastName());

        SaleDeal deal = SaleDeal.builder()
                .listingId(req.getListingId())
                .agentId(req.getAgentId())
                .dateClosed(req.getDateClosed())
                .salePrice(req.getSalePrice())
                .buyerId(buyer.getPersonId())
                .build();
        deal = saleRepo.save(deal);
        // DB trigger trgSaleAfterInsert sets listing status = 'Sold'
        return toSaleDTO(saleRepo.findById(deal.getListingId()).orElseThrow());
    }

    @Transactional
    public RentalDealDTO closeRental(RentalDealRequest req) {
        Listing listing = listingRepo.findById(req.getListingId())
                .orElseThrow(() -> new RuntimeException("Listing not found"));
        if (listing.getStatus() != ListingStatus.Open)
            throw new RuntimeException("Listing is not open");

        Person tenant = listingService.resolveOrCreatePerson(
                req.getTenantPhone(), req.getTenantEmail(),
                req.getTenantFirstName(), req.getTenantMiddleName(), req.getTenantLastName());

        RentalDeal deal = RentalDeal.builder()
                .listingId(req.getListingId())
                .agentId(req.getAgentId())
                .dateClosed(req.getDateClosed())
                .rentPrice(req.getRentPrice())
                .tenantId(tenant.getPersonId())
                .build();
        deal = rentalRepo.save(deal);
        return toRentalDTO(rentalRepo.findById(deal.getListingId()).orElseThrow());
    }

    public List<SaleDealDTO> getAllSales() {
        return saleRepo.findAll().stream().map(this::toSaleDTO).collect(Collectors.toList());
    }

    public List<RentalDealDTO> getAllRentals() {
        return rentalRepo.findAll().stream().map(this::toRentalDTO).collect(Collectors.toList());
    }

    public List<SaleDealDTO> getSalesByAgent(Integer agentId) {
        return saleRepo.findByAgentId(agentId).stream().map(this::toSaleDTO).collect(Collectors.toList());
    }

    public List<RentalDealDTO> getRentalsByAgent(Integer agentId) {
        return rentalRepo.findByAgentId(agentId).stream().map(this::toRentalDTO).collect(Collectors.toList());
    }

    // ── Mappers ───────────────────────────────────────────────────────────────
    private SaleDealDTO toSaleDTO(SaleDeal s) {
        SaleDealDTO dto = new SaleDealDTO();
        dto.setListingId(s.getListingId());
        dto.setAgentId(s.getAgentId());
        dto.setDateClosed(s.getDateClosed());
        dto.setSalePrice(s.getSalePrice());
        dto.setBuyerId(s.getBuyerId());
        if (s.getBuyer() != null) {
            dto.setBuyerName(s.getBuyer().getFirstName() + " " +
                    (s.getBuyer().getLastName() != null ? s.getBuyer().getLastName() : ""));
            dto.setBuyerPhone(s.getBuyer().getPhoneNo());
        }
        if (s.getAgent() != null && s.getAgent().getPerson() != null) {
            dto.setAgentName(s.getAgent().getPerson().getFirstName() + " " +
                    (s.getAgent().getPerson().getLastName() != null ? s.getAgent().getPerson().getLastName() : ""));
        }
        if (s.getListing() != null) {
            dto.setUnitNumber(s.getListing().getUnitNumber());
            buildingRepo.findById(s.getListing().getPropertyId()).ifPresent(b -> {
                dto.setCity(b.getCity());
                dto.setLocality(b.getLocality());
                dto.setBuildingName(b.getBuildingName());
            });
        }
        return dto;
    }

    private RentalDealDTO toRentalDTO(RentalDeal r) {
        RentalDealDTO dto = new RentalDealDTO();
        dto.setListingId(r.getListingId());
        dto.setAgentId(r.getAgentId());
        dto.setDateClosed(r.getDateClosed());
        dto.setRentPrice(r.getRentPrice());
        dto.setTenantId(r.getTenantId());
        if (r.getTenant() != null) {
            dto.setTenantName(r.getTenant().getFirstName() + " " +
                    (r.getTenant().getLastName() != null ? r.getTenant().getLastName() : ""));
            dto.setTenantPhone(r.getTenant().getPhoneNo());
        }
        if (r.getAgent() != null && r.getAgent().getPerson() != null) {
            dto.setAgentName(r.getAgent().getPerson().getFirstName() + " " +
                    (r.getAgent().getPerson().getLastName() != null ? r.getAgent().getPerson().getLastName() : ""));
        }
        if (r.getListing() != null) {
            dto.setUnitNumber(r.getListing().getUnitNumber());
            buildingRepo.findById(r.getListing().getPropertyId()).ifPresent(b -> {
                dto.setCity(b.getCity());
                dto.setLocality(b.getLocality());
                dto.setBuildingName(b.getBuildingName());
            });
        }
        return dto;
    }
}
