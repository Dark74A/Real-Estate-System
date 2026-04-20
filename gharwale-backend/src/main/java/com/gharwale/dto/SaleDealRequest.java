package com.gharwale.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data @NoArgsConstructor @AllArgsConstructor
public class SaleDealRequest {
    @NotNull private Integer listingId;
    @NotNull private Integer agentId;
    @NotNull private LocalDate dateClosed;
    @NotNull @Positive private BigDecimal salePrice;

    // Buyer lookup
    private String buyerPhone;
    private String buyerEmail;

    // If buyer doesn't exist — create
    private String buyerFirstName;
    private String buyerMiddleName;
    private String buyerLastName;
}
