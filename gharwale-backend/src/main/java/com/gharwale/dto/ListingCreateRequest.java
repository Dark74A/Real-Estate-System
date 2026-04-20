package com.gharwale.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data @NoArgsConstructor @AllArgsConstructor
public class ListingCreateRequest {

    @NotNull private Integer propertyId;
    @NotBlank private String unitNumber;

    // Owner lookup — at least one must be present
    private String ownerPhone;
    private String ownerEmail;

    // If owner doesn't exist, these are used to create them
    private String ownerFirstName;
    private String ownerMiddleName;
    private String ownerLastName;

    @NotBlank private String listingType;   // "SALE" or "RENT"

    @NotNull @Positive
    private BigDecimal listingPrice;

    @NotNull
    private LocalDate listingDate;
}
