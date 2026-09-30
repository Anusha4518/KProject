package com.military.assetmanagement.repository;

import com.military.assetmanagement.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    
    List<AuditLog> findTop100ByOrderByTimestampDesc();

    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:username IS NULL OR a.username LIKE %:username%) AND " +
           "(:actionType IS NULL OR a.actionType = :actionType) " +
           "ORDER BY a.timestamp DESC")
    List<AuditLog> filterLogs(@Param("username") String username, @Param("actionType") String actionType);
}
