package com.military.assetmanagement.audit;

import com.military.assetmanagement.security.UserPrincipal;
import com.military.assetmanagement.service.AuditLogService;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;
import java.util.logging.Level;
import java.util.logging.Logger;

@Aspect
@Component
public class AuditLoggingAspect {

    private static final Logger log = Logger.getLogger(AuditLoggingAspect.class.getName());
    private final AuditLogService auditLogService;

    public AuditLoggingAspect(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @AfterReturning(pointcut = "@annotation(Auditable)", returning = "result")
    public void logAuditAction(JoinPoint joinPoint, Object result) {
        try {
            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            Method method = signature.getMethod();
            Auditable auditable = method.getAnnotation(Auditable.class);

            if (auditable == null) return;

            Long userId = null;
            String username = "SYSTEM";
            String userRole = "SYSTEM";

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal principal) {
                userId = principal.getId();
                username = principal.getUsername();
                userRole = principal.getRole();
            }

            String ipAddress = getClientIpAddress();
            String details = extractDetails(joinPoint, result);
            Long entityId = extractEntityId(result);

            auditLogService.logAction(
                    userId,
                    username,
                    userRole,
                    auditable.actionType(),
                    auditable.entityType(),
                    entityId,
                    details,
                    ipAddress
            );

            log.info("Audit log recorded: user=" + username + " action=" + auditable.actionType() + " entity=" + auditable.entityType());
        } catch (Exception ex) {
            log.log(Level.SEVERE, "Failed to record audit log: " + ex.getMessage(), ex);
        }
    }

    private String getClientIpAddress() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            String xForwardedFor = request.getHeader("X-Forwarded-For");
            if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                return xForwardedFor.split(",")[0].trim();
            }
            return request.getRemoteAddr();
        }
        return "127.0.0.1";
    }

    private String extractDetails(JoinPoint joinPoint, Object result) {
        StringBuilder sb = new StringBuilder();
        sb.append("Method: ").append(joinPoint.getSignature().getName()).append("; ");
        Object[] args = joinPoint.getArgs();
        if (args != null && args.length > 0) {
            sb.append("Payload: ").append(args[0].toString());
        }
        return sb.toString();
    }

    private Long extractEntityId(Object result) {
        if (result == null) return null;
        try {
            Method getIdMethod = result.getClass().getMethod("getId");
            Object idVal = getIdMethod.invoke(result);
            if (idVal instanceof Long l) return l;
        } catch (Exception ignored) {}
        return null;
    }
}
