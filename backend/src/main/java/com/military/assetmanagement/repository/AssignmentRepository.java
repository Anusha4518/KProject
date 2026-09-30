package com.military.assetmanagement.repository;

import com.military.assetmanagement.model.Assignment;
import com.military.assetmanagement.model.AssignmentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    @Query("SELECT a FROM Assignment a WHERE " +
           "(:baseId IS NULL OR a.base.id = :baseId) AND " +
           "(:equipmentTypeId IS NULL OR a.equipmentType.id = :equipmentTypeId) AND " +
           "(:type IS NULL OR a.type = :type) AND " +
           "(:startDate IS NULL OR a.timestamp >= :startDate) AND " +
           "(:endDate IS NULL OR a.timestamp <= :endDate) " +
           "ORDER BY a.timestamp DESC")
    List<Assignment> filterAssignments(
        @Param("baseId") Long baseId,
        @Param("equipmentTypeId") Long equipmentTypeId,
        @Param("type") AssignmentType type,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
}
