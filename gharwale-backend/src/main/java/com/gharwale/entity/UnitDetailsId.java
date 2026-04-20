package com.gharwale.entity;

import lombok.*;
import java.io.Serializable;

@Data @NoArgsConstructor @AllArgsConstructor
public class UnitDetailsId implements Serializable {
    private Integer propertyId;
    private String unitNumber;
}
