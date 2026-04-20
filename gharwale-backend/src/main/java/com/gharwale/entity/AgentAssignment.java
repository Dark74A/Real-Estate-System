package com.gharwale.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "AgentAssignment")
@IdClass(AgentAssignmentId.class)
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AgentAssignment {

    @Id
    @Column(name = "agentId")
    private Integer agentId;

    @Id
    @Column(name = "listingId")
    private Integer listingId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "agentId", insertable = false, updatable = false)
    private Agent agent;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "listingId", insertable = false, updatable = false)
    private Listing listing;

    @Column(name = "assignmentDate", nullable = false)
    private LocalDate assignmentDate;
}
