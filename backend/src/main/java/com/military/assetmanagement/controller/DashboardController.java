package com.military.assetmanagement.controller;

import com.military.assetmanagement.dto.DashboardMetricsDTO;
import com.military.assetmanagement.dto.NetMovementBreakdownDTO;
import com.military.assetmanagement.security.UserPrincipal;
import com.military.assetmanagement.service.DashboardService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/metrics")
    public ResponseEntity<DashboardMetricsDTO> getMetrics(
            @RequestParam(required = false) Long baseId,
            @RequestParam(required = false) Long equipmentTypeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Long scopedBaseId = enforceBaseScope(baseId, userPrincipal);
        DashboardMetricsDTO metrics = dashboardService.getMetrics(scopedBaseId, equipmentTypeId, startDate, endDate);
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/net-movement-breakdown")
    public ResponseEntity<NetMovementBreakdownDTO> getNetMovementBreakdown(
            @RequestParam(required = false) Long baseId,
            @RequestParam(required = false) Long equipmentTypeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Long scopedBaseId = enforceBaseScope(baseId, userPrincipal);
        NetMovementBreakdownDTO breakdown = dashboardService.getNetMovementBreakdown(scopedBaseId, equipmentTypeId, startDate, endDate);
        return ResponseEntity.ok(breakdown);
    }

    private Long enforceBaseScope(Long requestedBaseId, UserPrincipal userPrincipal) {
        if (userPrincipal == null) return requestedBaseId;
        if ("ADMIN".equalsIgnoreCase(userPrincipal.getRole())) {
            return requestedBaseId;
        }
        return userPrincipal.getBaseId();
    }
}
