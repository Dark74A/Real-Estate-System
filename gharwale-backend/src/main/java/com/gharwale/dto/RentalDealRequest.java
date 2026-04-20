package com.gharwale.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data @NoArgsConstructor @AllArgsConstructor
public class RentalDealRequest {
    @NotNull private Integer listingId;
    @NotNull private Integer agentId;
    @NotNull private LocalDate dateClosed;
    @NotNull @Positive private BigDecimal rentPrice;

    // Tenant lookup
    private String tenantPhone;
    private String tenantEmail;

    // If tenant doesn't exist — create
    private String tenantFirstName;
    private String tenantMiddleName;
    private String tenantLastName;
}
