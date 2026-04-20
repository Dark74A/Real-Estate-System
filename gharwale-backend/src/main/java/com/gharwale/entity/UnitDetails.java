package com.gharwale.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import com.gharwale.converter.FacingConverter;

@Entity
@Table(name = "UnitDetails")
@IdClass(UnitDetailsId.class)
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class UnitDetails {

    @Id
    @Column(name = "propertyId")
    private Integer propertyId;

    @Id
    @Column(name = "unitNumber", length = 20)
    private String unitNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "propertyId", insertable = false, updatable = false)
    private Building building;

    @Column(name = "bedrooms", nullable = false)
    private Integer bedrooms;

    @Column(name = "bathrooms", nullable = false)
    private Integer bathrooms;

    @Column(name = "carpetArea", precision = 10, scale = 2)
    private BigDecimal carpetArea;

    @Column(name = "area", nullable = false, precision = 10, scale = 2)
    private BigDecimal area;

    @Column(name = "kitchen", nullable = false)
    private Integer kitchen = 1;

    @Convert(converter = FacingConverter.class)
    @Column(name = "facing", nullable = false)
    private Facing facing;

    @Column(name = "floor", nullable = false)
    private Integer floor;
}
