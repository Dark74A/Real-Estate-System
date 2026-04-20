package com.gharwale.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class ListingDetailsDTO {
    private String listingType;
    private BigDecimal listingPrice;
    private LocalDate listingDate;
}
