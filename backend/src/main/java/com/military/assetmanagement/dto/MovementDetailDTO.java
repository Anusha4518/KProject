package com.military.assetmanagement.dto;

import java.time.LocalDateTime;

public class MovementDetailDTO {
    private String id;
    private String code;
    private String movementType;
    private String equipmentName;
    private Integer quantity;
    private String sourceOrSupplier;
    private String destinationOrBase;
    private LocalDateTime timestamp;
    private String status;

    public MovementDetailDTO() {}

    public MovementDetailDTO(String id, String code, String movementType, String equipmentName, Integer quantity,
                             String sourceOrSupplier, String destinationOrBase, LocalDateTime timestamp, String status) {
        this.id = id;
        this.code = code;
        this.movementType = movementType;
        this.equipmentName = equipmentName;
        this.quantity = quantity;
        this.sourceOrSupplier = sourceOrSupplier;
        this.destinationOrBase = destinationOrBase;
        this.timestamp = timestamp;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getMovementType() { return movementType; }
    public void setMovementType(String movementType) { this.movementType = movementType; }

    public String getEquipmentName() { return equipmentName; }
    public void setEquipmentName(String equipmentName) { this.equipmentName = equipmentName; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getSourceOrSupplier() { return sourceOrSupplier; }
    public void setSourceOrSupplier(String sourceOrSupplier) { this.sourceOrSupplier = sourceOrSupplier; }

    public String getDestinationOrBase() { return destinationOrBase; }
    public void setDestinationOrBase(String destinationOrBase) { this.destinationOrBase = destinationOrBase; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
