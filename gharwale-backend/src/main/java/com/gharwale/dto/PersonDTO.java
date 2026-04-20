package com.gharwale.dto;

import lombok.*;

@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class PersonDTO {
    private Integer personId;
    private String firstName;
    private String middleName;
    private String lastName;
    private String phoneNo;
    private String email;

    public String getFullName() {
        StringBuilder sb = new StringBuilder(firstName);
        if (middleName != null && !middleName.isBlank()) sb.append(" ").append(middleName);
        if (lastName  != null && !lastName.isBlank())   sb.append(" ").append(lastName);
        return sb.toString();
    }
}
