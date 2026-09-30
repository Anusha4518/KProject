package com.military.assetmanagement.service;

import com.military.assetmanagement.model.AssetBalance;
import com.military.assetmanagement.repository.AssetBalanceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AssetBalanceService {

    private final AssetBalanceRepository assetBalanceRepository;

    public AssetBalanceService(AssetBalanceRepository assetBalanceRepository) {
        this.assetBalanceRepository = assetBalanceRepository;
    }

    @Transactional(readOnly = true)
    public List<AssetBalance> getBalances(Long baseId, Long equipmentTypeId) {
        return assetBalanceRepository.filterBalances(baseId, equipmentTypeId);
    }
}
