package com.military.assetmanagement.dto;

public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private Long userId;
    private String username;
    private String fullName;
    private String role;
    private Long baseId;
    private String baseName;
    private String rankTitle;

    public AuthResponse() {}

    public AuthResponse(String token, String tokenType, Long userId, String username, String fullName, String role, Long baseId, String baseName, String rankTitle) {
        this.token = token;
        this.tokenType = tokenType != null ? tokenType : "Bearer";
        this.userId = userId;
        this.username = username;
        this.fullName = fullName;
        this.role = role;
        this.baseId = baseId;
        this.baseName = baseName;
        this.rankTitle = rankTitle;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

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

    public String getRankTitle() { return rankTitle; }
    public void setRankTitle(String rankTitle) { this.rankTitle = rankTitle; }
}
