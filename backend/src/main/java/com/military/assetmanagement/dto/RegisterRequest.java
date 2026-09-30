package com.military.assetmanagement.dto;

import jakarta.validation.constraints.NotBlank;

public class RegisterRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String role; // LOGISTICS_OFFICER, BASE_COMMANDER, ADMIN

    private Long baseId;

    private String email;

    private String rankTitle;

    public RegisterRequest() {}

    public RegisterRequest(String username, String password, String fullName, String role, Long baseId, String email, String rankTitle) {
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
        this.baseId = baseId;
        this.email = email;
        this.rankTitle = rankTitle;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Long getBaseId() { return baseId; }
    public void setBaseId(Long baseId) { this.baseId = baseId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRankTitle() { return rankTitle; }
    public void setRankTitle(String rankTitle) { this.rankTitle = rankTitle; }
}
