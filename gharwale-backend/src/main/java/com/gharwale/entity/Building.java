package com.gharwale.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Building")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Building {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "propertyId")
    private Integer propertyId;

    @Column(name = "buildingName", length = 40)
    private String buildingName;

    @Column(name = "buildingNumber", nullable = false, length = 20)
    private String buildingNumber;

    @Column(name = "locality", nullable = false, length = 100)
    private String locality;

    @Column(name = "city", nullable = false, length = 50)
    private String city;

    @Column(name = "pincode", nullable = false, length = 6)
    private String pincode;

    @Enumerated(EnumType.STRING)
    @Column(name = "buildingType", nullable = false)
    private BuildingType buildingType;

    @Column(name = "yearOfConstruction", nullable = false)
    private Integer yearOfConstruction;
}
