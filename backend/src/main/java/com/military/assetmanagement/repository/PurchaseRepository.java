package com.military.assetmanagement.repository;

import com.military.assetmanagement.model.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    
    List<Purchase> findByBaseId(Long baseId);

    @Query("SELECT p FROM Purchase p WHERE " +
           "(:baseId IS NULL OR p.base.id = :baseId) AND " +
           "(:equipmentTypeId IS NULL OR p.equipmentType.id = :equipmentTypeId) AND " +
           "(:startDate IS NULL OR p.purchaseDate >= :startDate) AND " +
           "(:endDate IS NULL OR p.purchaseDate <= :endDate) " +
           "ORDER BY p.purchaseDate DESC")
    List<Purchase> filterPurchases(
        @Param("baseId") Long baseId,
        @Param("equipmentTypeId") Long equipmentTypeId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
}
