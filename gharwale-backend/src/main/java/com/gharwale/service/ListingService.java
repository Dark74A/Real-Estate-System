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
public class ListingService {

    private final ListingRepository listingRepo;
    private final ListingDetailsRepository detailsRepo;
    private final PersonRepository personRepo;
    private final UnitDetailsRepository unitRepo;
    private final BuildingRepository buildingRepo;

    public List<ListingDTO> getAllListings(String city, String status) {
        List<Listing> listings;
        if (city != null && !city.isBlank()) {
            listings = listingRepo.findByCity(city);
        } else if (status != null && !status.isBlank()) {
            listings = listingRepo.findByStatus(ListingStatus.valueOf(status));
        } else {
            listings = listingRepo.findAll();
        }
        return listings.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ListingDTO getById(Integer id) {
        return toDTO(listingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found: " + id)));
    }

    public List<ListingDTO> getByAgent(Integer agentId) {
        return listingRepo.findByAgentId(agentId).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public ListingDTO createListing(ListingCreateRequest req) {
        // Resolve or create owner
        Person owner = resolveOrCreatePerson(
                req.getOwnerPhone(), req.getOwnerEmail(),
                req.getOwnerFirstName(), req.getOwnerMiddleName(), req.getOwnerLastName());

        Listing listing = Listing.builder()
                .propertyId(req.getPropertyId())
                .unitNumber(req.getUnitNumber())
                .ownerId(owner.getPersonId())
                .status(ListingStatus.Open)
                .build();
        listing = listingRepo.save(listing);

        ListingDetails ld = ListingDetails.builder()
                .listingId(listing.getListingId())
                .listingType(req.getListingType().toUpperCase())
                .listingPrice(req.getListingPrice())
                .listingDate(req.getListingDate())
                .build();
        detailsRepo.save(ld);

        return toDTO(listingRepo.findById(listing.getListingId()).orElseThrow());
    }

    @Transactional
    public ListingDTO updateListing(Integer id, ListingCreateRequest req) {
        Listing listing = listingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found: " + id));
        if (listing.getStatus() != ListingStatus.Open)
            throw new RuntimeException("Cannot edit a closed/sold/rented listing");

        listing.setPropertyId(req.getPropertyId());
        listing.setUnitNumber(req.getUnitNumber());
        listingRepo.save(listing);

        // Update listing details price
        detailsRepo.findByListingIdAndListingType(id, req.getListingType().toUpperCase())
                .ifPresent(ld -> {
                    ld.setListingPrice(req.getListingPrice());
                    ld.setListingDate(req.getListingDate());
                    detailsRepo.save(ld);
                });
        return toDTO(listingRepo.findById(id).orElseThrow());
    }

    @Transactional
    public void deleteListing(Integer id) {
        Listing listing = listingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found: " + id));
        if (listing.getStatus() != ListingStatus.Open)
            throw new RuntimeException("Cannot delete a closed listing");
        listingRepo.deleteById(id);
    }

    // ── Helper: resolve or create person ─────────────────────────────────────
    public Person resolveOrCreatePerson(String phone, String email,
                                         String firstName, String middleName, String lastName) {
        if (phone != null && !phone.isBlank()) {
            var opt = personRepo.findByPhoneNo(phone);
            if (opt.isPresent()) return opt.get();
        }
        if (email != null && !email.isBlank()) {
            var opt = personRepo.findByEmail(email);
            if (opt.isPresent()) return opt.get();
        }
        // Create new
        if (firstName == null || firstName.isBlank())
            throw new RuntimeException("Owner/Person not found and firstName is required to create one");
        if ((phone == null || phone.isBlank()) && (email == null || email.isBlank()))
            throw new RuntimeException("Phone or email required");

        Person p = Person.builder()
                .firstName(firstName)
                .middleName(middleName)
                .lastName(lastName)
                .phoneNo(phone)
                .email(email)
                .build();
        return personRepo.save(p);
    }

    // ── Mapper ────────────────────────────────────────────────────────────────
    public ListingDTO toDTO(Listing l) {
        ListingDTO dto = new ListingDTO();
        dto.setListingId(l.getListingId());
        dto.setStatus(l.getStatus().name());
        dto.setPropertyId(l.getPropertyId());
        dto.setUnitNumber(l.getUnitNumber());
        dto.setOwnerId(l.getOwnerId());

        if (l.getOwner() != null) {
            dto.setOwnerName(l.getOwner().getFirstName()
                    + (l.getOwner().getLastName() != null ? " " + l.getOwner().getLastName() : ""));
            dto.setOwnerPhone(l.getOwner().getPhoneNo());
            dto.setOwnerEmail(l.getOwner().getEmail());
        }

        if (l.getUnit() != null) {
            UnitDetails u = l.getUnit();
            dto.setBedrooms(u.getBedrooms());
            dto.setBathrooms(u.getBathrooms());
            dto.setArea(u.getArea() != null ? u.getArea().doubleValue() : null);
            dto.setFacing(u.getFacing() != null ? u.getFacing().name() : null);
            dto.setFloor(u.getFloor());

            if (u.getBuilding() != null) {
                Building b = u.getBuilding();
                dto.setBuildingName(b.getBuildingName());
                dto.setBuildingNumber(b.getBuildingNumber());
                dto.setLocality(b.getLocality());
                dto.setCity(b.getCity());
                dto.setPincode(b.getPincode());
                dto.setBuildingType(b.getBuildingType().name());
            } else {
                // lazy — fetch building manually
                buildingRepo.findById(l.getPropertyId()).ifPresent(b -> {
                    dto.setBuildingName(b.getBuildingName());
                    dto.setBuildingNumber(b.getBuildingNumber());
                    dto.setLocality(b.getLocality());
                    dto.setCity(b.getCity());
                    dto.setPincode(b.getPincode());
                    dto.setBuildingType(b.getBuildingType().name());
                });
            }
        }

        List<ListingDetailsDTO> details = detailsRepo.findByListingId(l.getListingId())
                .stream().map(ld -> ListingDetailsDTO.builder()
                        .listingType(ld.getListingType())
                        .listingPrice(ld.getListingPrice())
                        .listingDate(ld.getListingDate())
                        .build())
                .collect(Collectors.toList());
        dto.setDetails(details);
        return dto;
    }
}
