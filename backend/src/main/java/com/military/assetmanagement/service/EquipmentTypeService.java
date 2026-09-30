package com.military.assetmanagement.service;

import com.military.assetmanagement.dto.EquipmentTypeDTO;
import com.military.assetmanagement.model.EquipmentType;
import com.military.assetmanagement.repository.EquipmentTypeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EquipmentTypeService {

    private final EquipmentTypeRepository equipmentTypeRepository;

    public EquipmentTypeService(EquipmentTypeRepository equipmentTypeRepository) {
        this.equipmentTypeRepository = equipmentTypeRepository;
    }

    @Transactional(readOnly = true)
    public List<EquipmentTypeDTO> getAllEquipmentTypes() {
        return equipmentTypeRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private EquipmentTypeDTO mapToDTO(EquipmentType eq) {
        return new EquipmentTypeDTO(
                eq.getId(),
                eq.getName(),
                eq.getCategory(),
                eq.getUnitOfMeasure(),
                eq.getDescription()
        );
    }
}
