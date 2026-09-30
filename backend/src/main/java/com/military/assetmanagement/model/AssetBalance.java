package com.military.assetmanagement.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "asset_balances", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"base_id", "equipment_type_id"})
})
public class AssetBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "base_id", nullable = false)
    private Base base;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "equipment_type_id", nullable = false)
    private EquipmentType equipmentType;

    @Column(name = "opening_balance", nullable = false)
    private Integer openingBalance = 0;

    @Column(name = "closing_balance", nullable = false)
    private Integer closingBalance = 0;

    @Column(name = "assigned_quantity", nullable = false)
    private Integer assignedQuantity = 0;

    @Column(name = "expended_quantity", nullable = false)
    private Integer expendedQuantity = 0;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    public AssetBalance() {}

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Base getBase() { return base; }
    public void setBase(Base base) { this.base = base; }

    public EquipmentType getEquipmentType() { return equipmentType; }
    public void setEquipmentType(EquipmentType equipmentType) { this.equipmentType = equipmentType; }

    public Integer getOpeningBalance() { return openingBalance != null ? openingBalance : 0; }
    public void setOpeningBalance(Integer openingBalance) { this.openingBalance = openingBalance; }

    public Integer getClosingBalance() { return closingBalance != null ? closingBalance : 0; }
    public void setClosingBalance(Integer closingBalance) { this.closingBalance = closingBalance; }

    public Integer getAssignedQuantity() { return assignedQuantity != null ? assignedQuantity : 0; }
    public void setAssignedQuantity(Integer assignedQuantity) { this.assignedQuantity = assignedQuantity; }

    public Integer getExpendedQuantity() { return expendedQuantity != null ? expendedQuantity : 0; }
    public void setExpendedQuantity(Integer expendedQuantity) { this.expendedQuantity = expendedQuantity; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}
