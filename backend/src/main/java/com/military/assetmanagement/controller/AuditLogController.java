package com.military.assetmanagement.controller;

import com.military.assetmanagement.dto.AuditLogDTO;
import com.military.assetmanagement.service.AuditLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@CrossOrigin(origins = "*")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'BASE_COMMANDER')")
    public ResponseEntity<List<AuditLogDTO>> getAuditLogs(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String actionType) {

        List<AuditLogDTO> logs = auditLogService.getRecentLogs(username, actionType);
        return ResponseEntity.ok(logs);
    }
}
