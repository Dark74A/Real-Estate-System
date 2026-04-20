package com.gharwale.dto;

import lombok.*;
import java.util.List;

@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class ListingDTO {
    private Integer listingId;
    private String status;

    // Building info
    private Integer propertyId;
    private String buildingName;
    private String buildingNumber;
    private String locality;
    private String city;
    private String pincode;
    private String buildingType;

    // Unit info
    private String unitNumber;
    private Integer bedrooms;
    private Integer bathrooms;
    private Double area;
    private String facing;
    private Integer floor;

    // Owner info
    private Integer ownerId;
    private String ownerName;
    private String ownerPhone;
    private String ownerEmail;

    // Listing price/type details
    private List<ListingDetailsDTO> details;
}
