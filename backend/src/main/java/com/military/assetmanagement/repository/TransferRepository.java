package com.military.assetmanagement.repository;

import com.military.assetmanagement.model.Transfer;
import com.military.assetmanagement.model.TransferStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransferRepository extends JpaRepository<Transfer, Long> {

    @Query("SELECT t FROM Transfer t WHERE " +
           "(:baseId IS NULL OR t.sourceBase.id = :baseId OR t.destinationBase.id = :baseId) AND " +
           "(:equipmentTypeId IS NULL OR t.equipmentType.id = :equipmentTypeId) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:startDate IS NULL OR t.createdAt >= :startDate) AND " +
           "(:endDate IS NULL OR t.createdAt <= :endDate) " +
           "ORDER BY t.createdAt DESC")
    List<Transfer> filterTransfers(
        @Param("baseId") Long baseId,
        @Param("equipmentTypeId") Long equipmentTypeId,
        @Param("status") TransferStatus status,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT t FROM Transfer t WHERE t.destinationBase.id = :baseId AND t.status = 'COMPLETED' AND " +
           "(:equipmentTypeId IS NULL OR t.equipmentType.id = :equipmentTypeId) AND " +
           "(:startDate IS NULL OR t.updatedAt >= :startDate) AND " +
           "(:endDate IS NULL OR t.updatedAt <= :endDate)")
    List<Transfer> findTransfersIn(
        @Param("baseId") Long baseId,
        @Param("equipmentTypeId") Long equipmentTypeId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT t FROM Transfer t WHERE t.sourceBase.id = :baseId AND t.status = 'COMPLETED' AND " +
           "(:equipmentTypeId IS NULL OR t.equipmentType.id = :equipmentTypeId) AND " +
           "(:startDate IS NULL OR t.updatedAt >= :startDate) AND " +
           "(:endDate IS NULL OR t.updatedAt <= :endDate)")
    List<Transfer> findTransfersOut(
        @Param("baseId") Long baseId,
        @Param("equipmentTypeId") Long equipmentTypeId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
}
