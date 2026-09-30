package com.military.assetmanagement.dto;

import com.military.assetmanagement.model.TransferStatus;
import java.time.LocalDateTime;

public class TransferResponseDTO {
    private Long id;
    private String transferCode;
    private Long sourceBaseId;
    private String sourceBaseName;
    private Long destinationBaseId;
    private String destinationBaseName;
    private Long equipmentTypeId;
    private String equipmentTypeName;
    private Integer quantity;
    private TransferStatus status;
    private String notes;
    private String requestedByUsername;
    private String approvedByUsername;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TransferResponseDTO() {}

    public TransferResponseDTO(Long id, String transferCode, Long sourceBaseId, String sourceBaseName,
                               Long destinationBaseId, String destinationBaseName, Long equipmentTypeId,
                               String equipmentTypeName, Integer quantity, TransferStatus status, String notes,
                               String requestedByUsername, String approvedByUsername, LocalDateTime createdAt,
                               LocalDateTime updatedAt) {
        this.id = id;
        this.transferCode = transferCode;
        this.sourceBaseId = sourceBaseId;
        this.sourceBaseName = sourceBaseName;
        this.destinationBaseId = destinationBaseId;
        this.destinationBaseName = destinationBaseName;
        this.equipmentTypeId = equipmentTypeId;
        this.equipmentTypeName = equipmentTypeName;
        this.quantity = quantity;
        this.status = status;
        this.notes = notes;
        this.requestedByUsername = requestedByUsername;
        this.approvedByUsername = approvedByUsername;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTransferCode() { return transferCode; }
    public void setTransferCode(String transferCode) { this.transferCode = transferCode; }

    public Long getSourceBaseId() { return sourceBaseId; }
    public void setSourceBaseId(Long sourceBaseId) { this.sourceBaseId = sourceBaseId; }

    public String getSourceBaseName() { return sourceBaseName; }
    public void setSourceBaseName(String sourceBaseName) { this.sourceBaseName = sourceBaseName; }

    public Long getDestinationBaseId() { return destinationBaseId; }
    public void setDestinationBaseId(Long destinationBaseId) { this.destinationBaseId = destinationBaseId; }

    public String getDestinationBaseName() { return destinationBaseName; }
    public void setDestinationBaseName(String destinationBaseName) { this.destinationBaseName = destinationBaseName; }

    public Long getEquipmentTypeId() { return equipmentTypeId; }
    public void setEquipmentTypeId(Long equipmentTypeId) { this.equipmentTypeId = equipmentTypeId; }

    public String getEquipmentTypeName() { return equipmentTypeName; }
    public void setEquipmentTypeName(String equipmentTypeName) { this.equipmentTypeName = equipmentTypeName; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public TransferStatus getStatus() { return status; }
    public void setStatus(TransferStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getRequestedByUsername() { return requestedByUsername; }
    public void setRequestedByUsername(String requestedByUsername) { this.requestedByUsername = requestedByUsername; }

    public String getApprovedByUsername() { return approvedByUsername; }
    public void setApprovedByUsername(String approvedByUsername) { this.approvedByUsername = approvedByUsername; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
