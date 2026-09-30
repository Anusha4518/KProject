package com.military.assetmanagement.controller;

import com.military.assetmanagement.dto.PurchaseRequestDTO;
import com.military.assetmanagement.dto.PurchaseResponseDTO;
import com.military.assetmanagement.security.UserPrincipal;
import com.military.assetmanagement.service.PurchaseService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/purchases")
@CrossOrigin(origins = "*")
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LOGISTICS_OFFICER', 'BASE_COMMANDER')")
    public ResponseEntity<PurchaseResponseDTO> recordPurchase(
            @Valid @RequestBody PurchaseRequestDTO request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        if (userPrincipal != null && !"ADMIN".equalsIgnoreCase(userPrincipal.getRole())) {
            if (userPrincipal.getBaseId() != null && !userPrincipal.getBaseId().equals(request.getBaseId())) {
                throw new RuntimeException("You can only record purchases for your assigned base");
            }
        }

        PurchaseResponseDTO response = purchaseService.recordPurchase(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<PurchaseResponseDTO>> getPurchases(
            @RequestParam(required = false) Long baseId,
            @RequestParam(required = false) Long equipmentTypeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Long scopedBaseId = enforceBaseScope(baseId, userPrincipal);
        List<PurchaseResponseDTO> purchases = purchaseService.getPurchases(scopedBaseId, equipmentTypeId, startDate, endDate);
        return ResponseEntity.ok(purchases);
    }

    private Long enforceBaseScope(Long requestedBaseId, UserPrincipal userPrincipal) {
        if (userPrincipal == null) return requestedBaseId;
        if ("ADMIN".equalsIgnoreCase(userPrincipal.getRole())) {
            return requestedBaseId;
        }
        return userPrincipal.getBaseId();
    }
}
