package com.military.assetmanagement.controller;

import com.military.assetmanagement.dto.EquipmentTypeDTO;
import com.military.assetmanagement.service.EquipmentTypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipment-types")
@CrossOrigin(origins = "*")
public class EquipmentTypeController {

    private final EquipmentTypeService equipmentTypeService;

    public EquipmentTypeController(EquipmentTypeService equipmentTypeService) {
        this.equipmentTypeService = equipmentTypeService;
    }

    @GetMapping
    public ResponseEntity<List<EquipmentTypeDTO>> getAllEquipmentTypes() {
        return ResponseEntity.ok(equipmentTypeService.getAllEquipmentTypes());
    }
}
