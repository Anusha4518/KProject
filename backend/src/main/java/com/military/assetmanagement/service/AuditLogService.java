package com.military.assetmanagement.service;

import com.military.assetmanagement.dto.AuditLogDTO;
import com.military.assetmanagement.model.AuditLog;
import com.military.assetmanagement.repository.AuditLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public AuditLog logAction(Long userId, String username, String userRole,
                              String actionType, String entityType, Long entityId,
                              String details, String ipAddress) {
        AuditLog log = new AuditLog();
        log.setTimestamp(LocalDateTime.now());
        log.setUserId(userId);
        log.setUsername(username);
        log.setUserRole(userRole);
        log.setActionType(actionType);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setDetails(details);
        log.setIpAddress(ipAddress != null ? ipAddress : "127.0.0.1");

        return auditLogRepository.save(log);
    }

    @Transactional(readOnly = true)
    public List<AuditLogDTO> getRecentLogs(String username, String actionType) {
        List<AuditLog> logs;
        if (username != null || actionType != null) {
            logs = auditLogRepository.filterLogs(username, actionType);
        } else {
            logs = auditLogRepository.findTop100ByOrderByTimestampDesc();
        }

        return logs.stream().map(log -> new AuditLogDTO(
                log.getId(),
                log.getTimestamp(),
                log.getUserId(),
                log.getUsername(),
                log.getUserRole(),
                log.getActionType(),
                log.getEntityType(),
                log.getEntityId(),
                log.getDetails(),
                log.getIpAddress()
        )).collect(Collectors.toList());
    }
}
