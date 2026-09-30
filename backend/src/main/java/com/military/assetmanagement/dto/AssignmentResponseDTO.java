package com.military.assetmanagement.dto;

import com.military.assetmanagement.model.AssignmentStatus;
import com.military.assetmanagement.model.AssignmentType;
import java.time.LocalDateTime;

public class AssignmentResponseDTO {
    private Long id;
    private String assignmentCode;
    private Long baseId;
    private String baseName;
    private Long equipmentTypeId;
    private String equipmentTypeName;
    private String personnelName;
    private String personnelRank;
    private Integer quantity;
    private AssignmentType type;
    private AssignmentStatus status;
    private String notes;
    private String createdByUsername;
    private LocalDateTime timestamp;

    public AssignmentResponseDTO() {}

    public AssignmentResponseDTO(Long id, String assignmentCode, Long baseId, String baseName, Long equipmentTypeId,
                                 String equipmentTypeName, String personnelName, String personnelRank, Integer quantity,
                                 AssignmentType type, AssignmentStatus status, String notes, String createdByUsername,
                                 LocalDateTime timestamp) {
        this.id = id;
        this.assignmentCode = assignmentCode;
        this.baseId = baseId;
        this.baseName = baseName;
        this.equipmentTypeId = equipmentTypeId;
        this.equipmentTypeName = equipmentTypeName;
        this.personnelName = personnelName;
        this.personnelRank = personnelRank;
        this.quantity = quantity;
        this.type = type;
        this.status = status;
        this.notes = notes;
        this.createdByUsername = createdByUsername;
        this.timestamp = timestamp;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAssignmentCode() { return assignmentCode; }
    public void setAssignmentCode(String assignmentCode) { this.assignmentCode = assignmentCode; }

    public Long getBaseId() { return baseId; }
    public void setBaseId(Long baseId) { this.baseId = baseId; }

    public String getBaseName() { return baseName; }
    public void setBaseName(String baseName) { this.baseName = baseName; }

    public Long getEquipmentTypeId() { return equipmentTypeId; }
    public void setEquipmentTypeId(Long equipmentTypeId) { this.equipmentTypeId = equipmentTypeId; }

    public String getEquipmentTypeName() { return equipmentTypeName; }
    public void setEquipmentTypeName(String equipmentTypeName) { this.equipmentTypeName = equipmentTypeName; }

    public String getPersonnelName() { return personnelName; }
    public void setPersonnelName(String personnelName) { this.personnelName = personnelName; }

    public String getPersonnelRank() { return personnelRank; }
    public void setPersonnelRank(String personnelRank) { this.personnelRank = personnelRank; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public AssignmentType getType() { return type; }
    public void setType(AssignmentType type) { this.type = type; }

    public AssignmentStatus getStatus() { return status; }
    public void setStatus(AssignmentStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getCreatedByUsername() { return createdByUsername; }
    public void setCreatedByUsername(String createdByUsername) { this.createdByUsername = createdByUsername; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
