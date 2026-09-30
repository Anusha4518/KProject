package com.military.assetmanagement.controller;

import com.military.assetmanagement.dto.TransferRequestDTO;
import com.military.assetmanagement.dto.TransferResponseDTO;
import com.military.assetmanagement.dto.TransferStatusUpdateDTO;
import com.military.assetmanagement.model.TransferStatus;
import com.military.assetmanagement.security.UserPrincipal;
import com.military.assetmanagement.service.TransferService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/transfers")
@CrossOrigin(origins = "*")
public class TransferController {

    private final TransferService transferService;

    public TransferController(TransferService transferService) {
        this.transferService = transferService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LOGISTICS_OFFICER', 'BASE_COMMANDER')")
    public ResponseEntity<TransferResponseDTO> initiateTransfer(
            @Valid @RequestBody TransferRequestDTO request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        if (userPrincipal != null && !"ADMIN".equalsIgnoreCase(userPrincipal.getRole())) {
            if (userPrincipal.getBaseId() != null && !userPrincipal.getBaseId().equals(request.getSourceBaseId())) {
                throw new RuntimeException("Transfers must originate from your assigned base");
            }
        }

        TransferResponseDTO response = transferService.initiateTransfer(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'BASE_COMMANDER', 'LOGISTICS_OFFICER')")
    public ResponseEntity<TransferResponseDTO> updateTransferStatus(
            @PathVariable Long id,
            @Valid @RequestBody TransferStatusUpdateDTO statusUpdate,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        TransferResponseDTO response = transferService.updateTransferStatus(id, statusUpdate);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<TransferResponseDTO>> getTransfers(
            @RequestParam(required = false) Long baseId,
            @RequestParam(required = false) Long equipmentTypeId,
            @RequestParam(required = false) TransferStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Long scopedBaseId = enforceBaseScope(baseId, userPrincipal);
        List<TransferResponseDTO> transfers = transferService.getTransfers(scopedBaseId, equipmentTypeId, status, startDate, endDate);
        return ResponseEntity.ok(transfers);
    }

    private Long enforceBaseScope(Long requestedBaseId, UserPrincipal userPrincipal) {
        if (userPrincipal == null) return requestedBaseId;
        if ("ADMIN".equalsIgnoreCase(userPrincipal.getRole())) {
            return requestedBaseId;
        }
        return userPrincipal.getBaseId();
    }
}
