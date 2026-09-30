package com.military.assetmanagement.dto;

public class DashboardMetricsDTO {
    private Integer openingBalance;
    private Integer closingBalance;
    private Integer netMovement;
    private Integer purchasesCount;
    private Integer transfersInCount;
    private Integer transfersOutCount;
    private Integer assignedAssets;
    private Integer expendedAssets;

    private Long baseId;
    private String baseName;
    private Long equipmentTypeId;
    private String equipmentTypeName;

    public DashboardMetricsDTO() {}

    public DashboardMetricsDTO(Integer openingBalance, Integer closingBalance, Integer netMovement,
                               Integer purchasesCount, Integer transfersInCount, Integer transfersOutCount,
                               Integer assignedAssets, Integer expendedAssets, Long baseId, String baseName,
                               Long equipmentTypeId, String equipmentTypeName) {
        this.openingBalance = openingBalance;
        this.closingBalance = closingBalance;
        this.netMovement = netMovement;
        this.purchasesCount = purchasesCount;
        this.transfersInCount = transfersInCount;
        this.transfersOutCount = transfersOutCount;
        this.assignedAssets = assignedAssets;
        this.expendedAssets = expendedAssets;
        this.baseId = baseId;
        this.baseName = baseName;
        this.equipmentTypeId = equipmentTypeId;
        this.equipmentTypeName = equipmentTypeName;
    }

    public Integer getOpeningBalance() { return openingBalance != null ? openingBalance : 0; }
    public void setOpeningBalance(Integer openingBalance) { this.openingBalance = openingBalance; }

    public Integer getClosingBalance() { return closingBalance != null ? closingBalance : 0; }
    public void setClosingBalance(Integer closingBalance) { this.closingBalance = closingBalance; }

    public Integer getNetMovement() { return netMovement != null ? netMovement : 0; }
    public void setNetMovement(Integer netMovement) { this.netMovement = netMovement; }

    public Integer getPurchasesCount() { return purchasesCount != null ? purchasesCount : 0; }
    public void setPurchasesCount(Integer purchasesCount) { this.purchasesCount = purchasesCount; }

    public Integer getTransfersInCount() { return transfersInCount != null ? transfersInCount : 0; }
    public void setTransfersInCount(Integer transfersInCount) { this.transfersInCount = transfersInCount; }

    public Integer getTransfersOutCount() { return transfersOutCount != null ? transfersOutCount : 0; }
    public void setTransfersOutCount(Integer transfersOutCount) { this.transfersOutCount = transfersOutCount; }

    public Integer getAssignedAssets() { return assignedAssets != null ? assignedAssets : 0; }
    public void setAssignedAssets(Integer assignedAssets) { this.assignedAssets = assignedAssets; }

    public Integer getExpendedAssets() { return expendedAssets != null ? expendedAssets : 0; }
    public void setExpendedAssets(Integer expendedAssets) { this.expendedAssets = expendedAssets; }

    public Long getBaseId() { return baseId; }
    public void setBaseId(Long baseId) { this.baseId = baseId; }

    public String getBaseName() { return baseName; }
    public void setBaseName(String baseName) { this.baseName = baseName; }

    public Long getEquipmentTypeId() { return equipmentTypeId; }
    public void setEquipmentTypeId(Long equipmentTypeId) { this.equipmentTypeId = equipmentTypeId; }

    public String getEquipmentTypeName() { return equipmentTypeName; }
    public void setEquipmentTypeName(String equipmentTypeName) { this.equipmentTypeName = equipmentTypeName; }
}
