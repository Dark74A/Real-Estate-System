package com.gharwale.dto;

import lombok.*;

@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class BuildingDTO {
    private Integer propertyId;
    private String buildingName;
    private String buildingNumber;
    private String locality;
    private String city;
    private String pincode;
    private String buildingType;
    private Integer yearOfConstruction;
}
