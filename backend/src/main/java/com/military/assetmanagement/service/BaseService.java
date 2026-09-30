package com.military.assetmanagement.service;

import com.military.assetmanagement.dto.BaseDTO;
import com.military.assetmanagement.model.Base;
import com.military.assetmanagement.repository.BaseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BaseService {

    private final BaseRepository baseRepository;

    public BaseService(BaseRepository baseRepository) {
        this.baseRepository = baseRepository;
    }

    @Transactional(readOnly = true)
    public List<BaseDTO> getAllBases() {
        return baseRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BaseDTO getBaseById(Long id) {
        Base base = baseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Base not found with ID: " + id));
        return mapToDTO(base);
    }

    private BaseDTO mapToDTO(Base base) {
        return new BaseDTO(
                base.getId(),
                base.getName(),
                base.getCode(),
                base.getLocation(),
                base.getCommandRegion()
        );
    }
}
