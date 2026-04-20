package com.gharwale.service;

import com.gharwale.dto.LoginRequest;
import com.gharwale.dto.LoginResponse;
import com.gharwale.entity.Agent;
import com.gharwale.repository.AgentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AgentRepository agentRepository;

    @Value("${app.admin.email}")    private String adminEmail;
    @Value("${app.admin.password}") private String adminPassword;
    @Value("${app.admin.name}")     private String adminName;

    public LoginResponse login(LoginRequest req) {
        if ("ADMIN".equalsIgnoreCase(req.getRole())) {
            if (!adminEmail.equals(req.getEmail()) || !adminPassword.equals(req.getPassword())) {
                throw new RuntimeException("Invalid admin credentials");
            }
            return LoginResponse.builder()
                    .role("ADMIN")
                    .id(0)
                    .name(adminName)
                    .email(adminEmail)
                    .build();
        }

        if ("AGENT".equalsIgnoreCase(req.getRole())) {
            Agent agent = agentRepository.findByPersonEmail(req.getEmail())
                    .orElseThrow(() -> new RuntimeException("No agent found with this email"));
            String fullName = agent.getPerson().getFirstName()
                    + (agent.getPerson().getLastName() != null ? " " + agent.getPerson().getLastName() : "");
            return LoginResponse.builder()
                    .role("AGENT")
                    .id(agent.getAgentId())
                    .name(fullName)
                    .email(agent.getPerson().getEmail())
                    .build();
        }

        throw new RuntimeException("Invalid role");
    }
}
