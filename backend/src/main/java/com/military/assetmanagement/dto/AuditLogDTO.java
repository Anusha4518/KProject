package com.military.assetmanagement.dto;

import java.time.LocalDateTime;

public class AuditLogDTO {
    private Long id;
    private LocalDateTime timestamp;
    private Long userId;
    private String username;
    private String userRole;
    private String actionType;
    private String entityType;
    private Long entityId;
    private String details;
    private String ipAddress;

    public AuditLogDTO() {}

    public AuditLogDTO(Long id, LocalDateTime timestamp, Long userId, String username, String userRole,
                       String actionType, String entityType, Long entityId, String details, String ipAddress) {
        this.id = id;
        this.timestamp = timestamp;
        this.userId = userId;
        this.username = username;
        this.userRole = userRole;
        this.actionType = actionType;
        this.entityType = entityType;
        this.entityId = entityId;
        this.details = details;
        this.ipAddress = ipAddress;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }

    public String getActionType() { return actionType; }
    public void setActionType(String actionType) { this.actionType = actionType; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public Long getEntityId() { return entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
}
