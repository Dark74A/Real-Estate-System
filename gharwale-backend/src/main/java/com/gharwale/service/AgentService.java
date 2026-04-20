package com.gharwale.service;

import com.gharwale.dto.*;
import com.gharwale.entity.*;
import com.gharwale.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AgentService {

    private final AgentRepository agentRepo;
    private final PersonRepository personRepo;
    private final EmploymentHistoryRepository empRepo;

    public List<AgentDTO> getAllAgents() {
        return agentRepo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public AgentDTO getAgentById(Integer id) {
        return toDTO(agentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Agent not found: " + id)));
    }

    @Transactional
    public AgentDTO createAgent(AgentCreateRequest req) {
        if (personRepo.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already in use: " + req.getEmail());
        if (personRepo.existsByPhoneNo(req.getPhoneNo()))
            throw new RuntimeException("Phone already in use: " + req.getPhoneNo());

        Person person = Person.builder()
                .firstName(req.getFirstName())
                .middleName(req.getMiddleName())
                .lastName(req.getLastName())
                .phoneNo(req.getPhoneNo())
                .email(req.getEmail())
                .build();
        person = personRepo.save(person);

        Agent agent = Agent.builder()
                .person(person)
                .licenseNo(req.getLicenseNo())
                .salary(req.getSalary())
                .aadhaarNumber(req.getAadhaarNumber())
                .agentStatus(AgentStatus.Active)
                .build();
        agent = agentRepo.save(agent);
        // DB trigger trgAgentAfterInsert auto-inserts EmploymentHistory
        return toDTO(agent);
    }

    @Transactional
    public AgentDTO updateAgent(Integer id, AgentCreateRequest req) {
        Agent agent = agentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Agent not found: " + id));
        Person person = agent.getPerson();
        person.setFirstName(req.getFirstName());
        person.setMiddleName(req.getMiddleName());
        person.setLastName(req.getLastName());
        person.setPhoneNo(req.getPhoneNo());
        person.setEmail(req.getEmail());
        personRepo.save(person);

        agent.setLicenseNo(req.getLicenseNo());
        agent.setSalary(req.getSalary());
        agent.setAadhaarNumber(req.getAadhaarNumber());
        return toDTO(agentRepo.save(agent));
    }

    @Transactional
    public void deleteAgent(Integer id) {
        if (!agentRepo.existsById(id))
            throw new RuntimeException("Agent not found: " + id);
        agentRepo.deleteById(id);
    }

    @Transactional
    public AgentDTO setStatus(Integer id, String status) {
        Agent agent = agentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Agent not found: " + id));
        AgentStatus newStatus = AgentStatus.valueOf(status);
        agent.setAgentStatus(newStatus);
        agent = agentRepo.save(agent);
        // DB triggers trgAgentAfterUpdate auto-manages EmploymentHistory
        return toDTO(agent);
    }

    public List<EmploymentHistoryDTO> getEmploymentHistory(Integer agentId) {
        return empRepo.findByAgentIdOrderByDateOfJoiningDesc(agentId)
                .stream().map(e -> EmploymentHistoryDTO.builder()
                        .agentId(e.getAgentId())
                        .dateOfJoining(e.getDateOfJoining())
                        .dateOfLeaving(e.getDateOfLeaving())
                        .status(e.getDateOfLeaving() == null ? "Current" : "Past")
                        .build())
                .collect(Collectors.toList());
    }

    // ── Mapper ────────────────────────────────────────────────────────────────
    public AgentDTO toDTO(Agent a) {
        return AgentDTO.builder()
                .agentId(a.getAgentId())
                .firstName(a.getPerson().getFirstName())
                .middleName(a.getPerson().getMiddleName())
                .lastName(a.getPerson().getLastName())
                .phoneNo(a.getPerson().getPhoneNo())
                .email(a.getPerson().getEmail())
                .licenseNo(a.getLicenseNo())
                .agentStatus(a.getAgentStatus().name())
                .salary(a.getSalary())
                .aadhaarNumber(a.getAadhaarNumber())
                .build();
    }
}
