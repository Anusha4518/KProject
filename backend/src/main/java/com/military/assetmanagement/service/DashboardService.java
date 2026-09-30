package com.military.assetmanagement.service;

import com.military.assetmanagement.dto.DashboardMetricsDTO;
import com.military.assetmanagement.dto.MovementDetailDTO;
import com.military.assetmanagement.dto.NetMovementBreakdownDTO;
import com.military.assetmanagement.model.AssetBalance;
import com.military.assetmanagement.model.Purchase;
import com.military.assetmanagement.model.Transfer;
import com.military.assetmanagement.model.TransferStatus;
import com.military.assetmanagement.repository.AssetBalanceRepository;
import com.military.assetmanagement.repository.PurchaseRepository;
import com.military.assetmanagement.repository.TransferRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final AssetBalanceRepository assetBalanceRepository;
    private final PurchaseRepository purchaseRepository;
    private final TransferRepository transferRepository;

    public DashboardService(AssetBalanceRepository assetBalanceRepository,
                            PurchaseRepository purchaseRepository,
                            TransferRepository transferRepository) {
        this.assetBalanceRepository = assetBalanceRepository;
        this.purchaseRepository = purchaseRepository;
        this.transferRepository = transferRepository;
    }

    @Transactional(readOnly = true)
    public DashboardMetricsDTO getMetrics(Long baseId, Long equipmentTypeId, LocalDateTime startDate, LocalDateTime endDate) {
        List<AssetBalance> balances = assetBalanceRepository.filterBalances(baseId, equipmentTypeId);
        int openingSum = balances.stream().mapToInt(AssetBalance::getOpeningBalance).sum();
        int closingSum = balances.stream().mapToInt(AssetBalance::getClosingBalance).sum();
        int assignedSum = balances.stream().mapToInt(AssetBalance::getAssignedQuantity).sum();
        int expendedSum = balances.stream().mapToInt(AssetBalance::getExpendedQuantity).sum();

        List<Purchase> purchases = purchaseRepository.filterPurchases(baseId, equipmentTypeId, startDate, endDate);
        int purchasesQty = purchases.stream().mapToInt(Purchase::getQuantity).sum();

        int transfersInQty = 0;
        int transfersOutQty = 0;

        if (baseId != null) {
            List<Transfer> trfIn = transferRepository.findTransfersIn(baseId, equipmentTypeId, startDate, endDate);
            transfersInQty = trfIn.stream().mapToInt(Transfer::getQuantity).sum();

            List<Transfer> trfOut = transferRepository.findTransfersOut(baseId, equipmentTypeId, startDate, endDate);
            transfersOutQty = trfOut.stream().mapToInt(Transfer::getQuantity).sum();
        } else {
            List<Transfer> completed = transferRepository.filterTransfers(null, equipmentTypeId, TransferStatus.COMPLETED, startDate, endDate);
            transfersInQty = completed.stream().mapToInt(Transfer::getQuantity).sum();
            transfersOutQty = 0;
        }

        int netMovement = purchasesQty + transfersInQty - transfersOutQty;

        return new DashboardMetricsDTO(
                openingSum,
                closingSum,
                netMovement,
                purchasesQty,
                transfersInQty,
                transfersOutQty,
                assignedSum,
                expendedSum,
                baseId,
                null,
                equipmentTypeId,
                null
        );
    }

    @Transactional(readOnly = true)
    public NetMovementBreakdownDTO getNetMovementBreakdown(Long baseId, Long equipmentTypeId, LocalDateTime startDate, LocalDateTime endDate) {
        List<Purchase> purchases = purchaseRepository.filterPurchases(baseId, equipmentTypeId, startDate, endDate);
        List<MovementDetailDTO> purchaseLogs = purchases.stream().map(p -> new MovementDetailDTO(
                "PUR-" + p.getId(),
                p.getPurchaseCode(),
                "PURCHASE",
                p.getEquipmentType().getName(),
                p.getQuantity(),
                p.getSupplier() != null ? p.getSupplier() : "Direct Acquisition",
                p.getBase().getName(),
                p.getPurchaseDate(),
                "COMPLETED"
        )).collect(Collectors.toList());

        List<MovementDetailDTO> trfInLogs = new ArrayList<>();
        List<MovementDetailDTO> trfOutLogs = new ArrayList<>();

        if (baseId != null) {
            List<Transfer> trfIn = transferRepository.findTransfersIn(baseId, equipmentTypeId, startDate, endDate);
            trfInLogs = trfIn.stream().map(t -> new MovementDetailDTO(
                    "TRF-IN-" + t.getId(),
                    t.getTransferCode(),
                    "TRANSFER_IN",
                    t.getEquipmentType().getName(),
                    t.getQuantity(),
                    t.getSourceBase().getName(),
                    t.getDestinationBase().getName(),
                    t.getUpdatedAt(),
                    t.getStatus().name()
            )).collect(Collectors.toList());

            List<Transfer> trfOut = transferRepository.findTransfersOut(baseId, equipmentTypeId, startDate, endDate);
            trfOutLogs = trfOut.stream().map(t -> new MovementDetailDTO(
                    "TRF-OUT-" + t.getId(),
                    t.getTransferCode(),
                    "TRANSFER_OUT",
                    t.getEquipmentType().getName(),
                    t.getQuantity(),
                    t.getSourceBase().getName(),
                    t.getDestinationBase().getName(),
                    t.getUpdatedAt(),
                    t.getStatus().name()
            )).collect(Collectors.toList());
        }

        int totalPurchases = purchaseLogs.stream().mapToInt(MovementDetailDTO::getQuantity).sum();
        int totalTransfersIn = trfInLogs.stream().mapToInt(MovementDetailDTO::getQuantity).sum();
        int totalTransfersOut = trfOutLogs.stream().mapToInt(MovementDetailDTO::getQuantity).sum();
        int netMovement = totalPurchases + totalTransfersIn - totalTransfersOut;

        return new NetMovementBreakdownDTO(
                netMovement,
                totalPurchases,
                totalTransfersIn,
                totalTransfersOut,
                purchaseLogs,
                trfInLogs,
                trfOutLogs
        );
    }
}
