package com.military.assetmanagement.dto;

public class EquipmentTypeDTO {
    private Long id;
    private String name;
    private String category;
    private String unitOfMeasure;
    private String description;

    public EquipmentTypeDTO() {}

    public EquipmentTypeDTO(Long id, String name, String category, String unitOfMeasure, String description) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.unitOfMeasure = unitOfMeasure;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getUnitOfMeasure() { return unitOfMeasure; }
    public void setUnitOfMeasure(String unitOfMeasure) { this.unitOfMeasure = unitOfMeasure; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
