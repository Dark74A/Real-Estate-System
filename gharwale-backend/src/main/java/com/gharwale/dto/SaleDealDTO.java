package com.gharwale.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class SaleDealDTO {
    private Integer listingId;
    private Integer agentId;
    private String agentName;
    private LocalDate dateClosed;
    private BigDecimal salePrice;
    private Integer buyerId;
    private String buyerName;
    private String buyerPhone;
    // listing snapshot
    private String city;
    private String locality;
    private String buildingName;
    private String unitNumber;
}
