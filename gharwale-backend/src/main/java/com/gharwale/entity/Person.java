package com.gharwale.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Person")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "personId")
    private Integer personId;

    @Column(name = "firstName", nullable = false, length = 50)
    private String firstName;

    @Column(name = "middleName", length = 50)
    private String middleName;

    @Column(name = "lastName", length = 50)
    private String lastName;

    @Column(name = "phoneNo", nullable = false, length = 15, unique = true)
    private String phoneNo;

    @Column(name = "email", nullable = false, length = 100, unique = true)
    private String email;
}
