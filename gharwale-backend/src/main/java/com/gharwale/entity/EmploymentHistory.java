package com.gharwale.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "EmploymentHistory")
@IdClass(EmploymentHistoryId.class)
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class EmploymentHistory {

    @Id
    @Column(name = "agentId")
    private Integer agentId;

    @Id
    @Column(name = "dateOfJoining")
    private LocalDate dateOfJoining;

    @Column(name = "dateOfLeaving")
    private LocalDate dateOfLeaving;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agentId", insertable = false, updatable = false)
    private Agent agent;
}
