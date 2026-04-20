package com.gharwale.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class RentalDealDTO {
    private Integer listingId;
    private Integer agentId;
    private String agentName;
    private LocalDate dateClosed;
    private BigDecimal rentPrice;
    private Integer tenantId;
    private String tenantName;
    private String tenantPhone;
    private String city;
    private String locality;
    private String buildingName;
    private String unitNumber;
}
