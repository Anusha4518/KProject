package com.military.assetmanagement.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PurchaseResponseDTO {
    private Long id;
    private String purchaseCode;
    private Long baseId;
    private String baseName;
    private Long equipmentTypeId;
    private String equipmentTypeName;
    private String equipmentCategory;
    private Integer quantity;
    private BigDecimal unitCost;
    private BigDecimal totalCost;
    private String supplier;
    private LocalDateTime purchaseDate;
    private String createdByUsername;
    private LocalDateTime createdAt;

    public PurchaseResponseDTO() {}

    public PurchaseResponseDTO(Long id, String purchaseCode, Long baseId, String baseName, Long equipmentTypeId,
                               String equipmentTypeName, String equipmentCategory, Integer quantity, BigDecimal unitCost,
                               BigDecimal totalCost, String supplier, LocalDateTime purchaseDate, String createdByUsername,
                               LocalDateTime createdAt) {
        this.id = id;
        this.purchaseCode = purchaseCode;
        this.baseId = baseId;
        this.baseName = baseName;
        this.equipmentTypeId = equipmentTypeId;
        this.equipmentTypeName = equipmentTypeName;
        this.equipmentCategory = equipmentCategory;
        this.quantity = quantity;
        this.unitCost = unitCost;
        this.totalCost = totalCost;
        this.supplier = supplier;
        this.purchaseDate = purchaseDate;
        this.createdByUsername = createdByUsername;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPurchaseCode() { return purchaseCode; }
    public void setPurchaseCode(String purchaseCode) { this.purchaseCode = purchaseCode; }

    public Long getBaseId() { return baseId; }
    public void setBaseId(Long baseId) { this.baseId = baseId; }

    public String getBaseName() { return baseName; }
    public void setBaseName(String baseName) { this.baseName = baseName; }

    public Long getEquipmentTypeId() { return equipmentTypeId; }
    public void setEquipmentTypeId(Long equipmentTypeId) { this.equipmentTypeId = equipmentTypeId; }

    public String getEquipmentTypeName() { return equipmentTypeName; }
    public void setEquipmentTypeName(String equipmentTypeName) { this.equipmentTypeName = equipmentTypeName; }

    public String getEquipmentCategory() { return equipmentCategory; }
    public void setEquipmentCategory(String equipmentCategory) { this.equipmentCategory = equipmentCategory; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitCost() { return unitCost; }
    public void setUnitCost(BigDecimal unitCost) { this.unitCost = unitCost; }

    public BigDecimal getTotalCost() { return totalCost; }
    public void setTotalCost(BigDecimal totalCost) { this.totalCost = totalCost; }

    public String getSupplier() { return supplier; }
    public void setSupplier(String supplier) { this.supplier = supplier; }

    public LocalDateTime getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(LocalDateTime purchaseDate) { this.purchaseDate = purchaseDate; }

    public String getCreatedByUsername() { return createdByUsername; }
    public void setCreatedByUsername(String createdByUsername) { this.createdByUsername = createdByUsername; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
