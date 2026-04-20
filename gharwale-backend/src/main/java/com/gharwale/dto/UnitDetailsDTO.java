package com.gharwale.dto;

import lombok.*;
import java.math.BigDecimal;

@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class UnitDetailsDTO {
    private Integer propertyId;
    private String unitNumber;
    private Integer bedrooms;
    private Integer bathrooms;
    private BigDecimal carpetArea;
    private BigDecimal area;
    private Integer kitchen;
    private String facing;
    private Integer floor;
}
