package com.military.assetmanagement.controller;

import com.military.assetmanagement.dto.AssignmentRequestDTO;
import com.military.assetmanagement.dto.AssignmentResponseDTO;
import com.military.assetmanagement.dto.ExpenditureRequestDTO;
import com.military.assetmanagement.model.AssignmentType;
import com.military.assetmanagement.security.UserPrincipal;
import com.military.assetmanagement.service.AssignmentService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "*")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LOGISTICS_OFFICER', 'BASE_COMMANDER')")
    public ResponseEntity<AssignmentResponseDTO> createAssignment(
            @Valid @RequestBody AssignmentRequestDTO request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        if (userPrincipal != null && !"ADMIN".equalsIgnoreCase(userPrincipal.getRole())) {
            if (userPrincipal.getBaseId() != null && !userPrincipal.getBaseId().equals(request.getBaseId())) {
                throw new RuntimeException("You can only assign assets for your assigned base");
            }
        }

        AssignmentResponseDTO response = assignmentService.createAssignment(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/expenditure")
    @PreAuthorize("hasAnyRole('ADMIN', 'LOGISTICS_OFFICER', 'BASE_COMMANDER')")
    public ResponseEntity<AssignmentResponseDTO> recordExpenditure(
            @Valid @RequestBody ExpenditureRequestDTO request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        if (userPrincipal != null && !"ADMIN".equalsIgnoreCase(userPrincipal.getRole())) {
            if (userPrincipal.getBaseId() != null && !userPrincipal.getBaseId().equals(request.getBaseId())) {
                throw new RuntimeException("You can only record expenditures for your assigned base");
            }
        }

        AssignmentResponseDTO response = assignmentService.recordExpenditure(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<AssignmentResponseDTO>> getAssignments(
            @RequestParam(required = false) Long baseId,
            @RequestParam(required = false) Long equipmentTypeId,
            @RequestParam(required = false) AssignmentType type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Long scopedBaseId = enforceBaseScope(baseId, userPrincipal);
        List<AssignmentResponseDTO> list = assignmentService.getAssignments(scopedBaseId, equipmentTypeId, type, startDate, endDate);
        return ResponseEntity.ok(list);
    }

    private Long enforceBaseScope(Long requestedBaseId, UserPrincipal userPrincipal) {
        if (userPrincipal == null) return requestedBaseId;
        if ("ADMIN".equalsIgnoreCase(userPrincipal.getRole())) {
            return requestedBaseId;
        }
        return userPrincipal.getBaseId();
    }
}
