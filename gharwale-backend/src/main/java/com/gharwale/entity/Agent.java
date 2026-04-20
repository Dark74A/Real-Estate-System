package com.gharwale.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "Agent")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Agent {

    @Id
    @Column(name = "agentId")
    private Integer agentId;

    @OneToOne(fetch = FetchType.EAGER)
    @MapsId
    @JoinColumn(name = "agentId")
    private Person person;

    @Column(name = "licenseNo", nullable = false, length = 50, unique = true)
    private String licenseNo;

    @Enumerated(EnumType.STRING)
    @Column(name = "agentStatus", nullable = false)
    private AgentStatus agentStatus = AgentStatus.Active;

    @Column(name = "salary", nullable = false, precision = 12, scale = 2)
    private BigDecimal salary;

    @Column(name = "aadhaarNumber", nullable = false, length = 12, unique = true)
    private String aadhaarNumber;
}
