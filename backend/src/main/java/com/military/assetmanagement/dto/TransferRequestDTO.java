package com.military.assetmanagement.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class TransferRequestDTO {

    @NotNull(message = "Source base ID is required")
    private Long sourceBaseId;

    @NotNull(message = "Destination base ID is required")
    private Long destinationBaseId;

    @NotNull(message = "Equipment Type ID is required")
    private Long equipmentTypeId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    private String notes;

    public Long getSourceBaseId() { return sourceBaseId; }
    public void setSourceBaseId(Long sourceBaseId) { this.sourceBaseId = sourceBaseId; }

    public Long getDestinationBaseId() { return destinationBaseId; }
    public void setDestinationBaseId(Long destinationBaseId) { this.destinationBaseId = destinationBaseId; }

    public Long getEquipmentTypeId() { return equipmentTypeId; }
    public void setEquipmentTypeId(Long equipmentTypeId) { this.equipmentTypeId = equipmentTypeId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
