package com.military.assetmanagement.repository;

import com.military.assetmanagement.model.AssetBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssetBalanceRepository extends JpaRepository<AssetBalance, Long> {
    
    Optional<AssetBalance> findByBaseIdAndEquipmentTypeId(Long baseId, Long equipmentTypeId);

    List<AssetBalance> findByBaseId(Long baseId);

    List<AssetBalance> findByEquipmentTypeId(Long equipmentTypeId);

    @Query("SELECT b FROM AssetBalance b WHERE (:baseId IS NULL OR b.base.id = :baseId) AND (:equipmentTypeId IS NULL OR b.equipmentType.id = :equipmentTypeId)")
    List<AssetBalance> filterBalances(@Param("baseId") Long baseId, @Param("equipmentTypeId") Long equipmentTypeId);
}
