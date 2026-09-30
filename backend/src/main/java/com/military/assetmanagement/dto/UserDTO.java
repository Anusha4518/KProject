package com.military.assetmanagement.dto;

public class UserDTO {
    private Long id;
    private String username;
    private String fullName;
    private String role;
    private Long baseId;
    private String baseName;
    private String email;
    private String rankTitle;

    public UserDTO() {}

    public UserDTO(Long id, String username, String fullName, String role, Long baseId, String baseName, String email, String rankTitle) {
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.role = role;
        this.baseId = baseId;
        this.baseName = baseName;
        this.email = email;
        this.rankTitle = rankTitle;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Long getBaseId() { return baseId; }
    public void setBaseId(Long baseId) { this.baseId = baseId; }

    public String getBaseName() { return baseName; }
    public void setBaseName(String baseName) { this.baseName = baseName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRankTitle() { return rankTitle; }
    public void setRankTitle(String rankTitle) { this.rankTitle = rankTitle; }
}
