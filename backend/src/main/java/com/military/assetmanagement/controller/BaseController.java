package com.military.assetmanagement.controller;

import com.military.assetmanagement.dto.BaseDTO;
import com.military.assetmanagement.service.BaseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bases")
@CrossOrigin(origins = "*")
public class BaseController {

    private final BaseService baseService;

    public BaseController(BaseService baseService) {
        this.baseService = baseService;
    }

    @GetMapping
    public ResponseEntity<List<BaseDTO>> getAllBases() {
        return ResponseEntity.ok(baseService.getAllBases());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseDTO> getBaseById(@PathVariable Long id) {
        return ResponseEntity.ok(baseService.getBaseById(id));
    }
}
