package com.military.assetmanagement.service;

import com.military.assetmanagement.audit.Auditable;
import com.military.assetmanagement.dto.TransferRequestDTO;
import com.military.assetmanagement.dto.TransferResponseDTO;
import com.military.assetmanagement.dto.TransferStatusUpdateDTO;
import com.military.assetmanagement.model.*;
import com.military.assetmanagement.repository.*;
import com.military.assetmanagement.security.UserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TransferService {

    private final TransferRepository transferRepository;
    private final BaseRepository baseRepository;
    private final EquipmentTypeRepository equipmentTypeRepository;
    private final AssetBalanceRepository assetBalanceRepository;
    private final UserRepository userRepository;

    public TransferService(TransferRepository transferRepository,
                           BaseRepository baseRepository,
                           EquipmentTypeRepository equipmentTypeRepository,
                           AssetBalanceRepository assetBalanceRepository,
                           UserRepository userRepository) {
        this.transferRepository = transferRepository;
        this.baseRepository = baseRepository;
        this.equipmentTypeRepository = equipmentTypeRepository;
        this.assetBalanceRepository = assetBalanceRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    @Auditable(actionType = "TRANSFER_INITIATED", entityType = "Transfer")
    public TransferResponseDTO initiateTransfer(TransferRequestDTO request) {
        if (request.getSourceBaseId().equals(request.getDestinationBaseId())) {
            throw new RuntimeException("Source and destination bases cannot be identical");
        }

        Base sourceBase = baseRepository.findById(request.getSourceBaseId())
                .orElseThrow(() -> new RuntimeException("Source Base not found: " + request.getSourceBaseId()));

        Base destBase = baseRepository.findById(request.getDestinationBaseId())
                .orElseThrow(() -> new RuntimeException("Destination Base not found: " + request.getDestinationBaseId()));

        EquipmentType equipmentType = equipmentTypeRepository.findById(request.getEquipmentTypeId())
                .orElseThrow(() -> new RuntimeException("Equipment Type not found: " + request.getEquipmentTypeId()));

        AssetBalance sourceBalance = assetBalanceRepository
                .findByBaseIdAndEquipmentTypeId(sourceBase.getId(), equipmentType.getId())
                .orElseThrow(() -> new RuntimeException("Source base has no inventory record for " + equipmentType.getName()));

        if (sourceBalance.getClosingBalance() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock at source base. Available: " + sourceBalance.getClosingBalance());
        }

        User currentUser = getCurrentUser();
        String code = "TRF-" + LocalDateTime.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        TransferStatus initialStatus = TransferStatus.PENDING;
        if (currentUser != null && (currentUser.getRole() == Role.ADMIN || currentUser.getRole() == Role.BASE_COMMANDER)) {
            initialStatus = TransferStatus.COMPLETED;
        }

        Transfer transfer = new Transfer();
        transfer.setTransferCode(code);
        transfer.setSourceBase(sourceBase);
        transfer.setDestinationBase(destBase);
        transfer.setEquipmentType(equipmentType);
        transfer.setQuantity(request.getQuantity());
        transfer.setStatus(initialStatus);
        transfer.setNotes(request.getNotes());
        transfer.setRequestedBy(currentUser);
        transfer.setApprovedBy(initialStatus == TransferStatus.COMPLETED ? currentUser : null);

        Transfer saved = transferRepository.save(transfer);

        if (initialStatus == TransferStatus.COMPLETED) {
            executeTransferBalances(sourceBase, destBase, equipmentType, request.getQuantity());
        }

        return mapToDTO(saved);
    }

    @Transactional
    @Auditable(actionType = "TRANSFER_STATUS_UPDATED", entityType = "Transfer")
    public TransferResponseDTO updateTransferStatus(Long id, TransferStatusUpdateDTO statusUpdate) {
        Transfer transfer = transferRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transfer not found: " + id));

        if (transfer.getStatus() == TransferStatus.COMPLETED || transfer.getStatus() == TransferStatus.REJECTED) {
            throw new RuntimeException("Transfer status is already finalized as " + transfer.getStatus());
        }

        User currentUser = getCurrentUser();
        transfer.setStatus(statusUpdate.getStatus());
        transfer.setApprovedBy(currentUser);
        if (statusUpdate.getNotes() != null && !statusUpdate.getNotes().isEmpty()) {
            transfer.setNotes(transfer.getNotes() + " | Update Note: " + statusUpdate.getNotes());
        }

        if (statusUpdate.getStatus() == TransferStatus.APPROVED || statusUpdate.getStatus() == TransferStatus.COMPLETED) {
            executeTransferBalances(transfer.getSourceBase(), transfer.getDestinationBase(), transfer.getEquipmentType(), transfer.getQuantity());
            transfer.setStatus(TransferStatus.COMPLETED);
        }

        Transfer updated = transferRepository.save(transfer);
        return mapToDTO(updated);
    }

    @Transactional(readOnly = true)
    public List<TransferResponseDTO> getTransfers(Long baseId, Long equipmentTypeId, TransferStatus status, LocalDateTime startDate, LocalDateTime endDate) {
        return transferRepository.filterTransfers(baseId, equipmentTypeId, status, startDate, endDate).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private void executeTransferBalances(Base sourceBase, Base destBase, EquipmentType equipmentType, int quantity) {
        AssetBalance sourceBalance = assetBalanceRepository
                .findByBaseIdAndEquipmentTypeId(sourceBase.getId(), equipmentType.getId())
                .orElseThrow(() -> new RuntimeException("Source balance missing"));
        sourceBalance.setClosingBalance(sourceBalance.getClosingBalance() - quantity);
        assetBalanceRepository.save(sourceBalance);

        AssetBalance destBalance = assetBalanceRepository
                .findByBaseIdAndEquipmentTypeId(destBase.getId(), equipmentType.getId())
                .orElseGet(() -> {
                    AssetBalance ab = new AssetBalance();
                    ab.setBase(destBase);
                    ab.setEquipmentType(equipmentType);
                    ab.setOpeningBalance(0);
                    ab.setClosingBalance(0);
                    ab.setAssignedQuantity(0);
                    ab.setExpendedQuantity(0);
                    return ab;
                });
        destBalance.setClosingBalance(destBalance.getClosingBalance() + quantity);
        assetBalanceRepository.save(destBalance);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal principal) {
            return userRepository.findById(principal.getId()).orElse(null);
        }
        return null;
    }

    private TransferResponseDTO mapToDTO(Transfer t) {
        return new TransferResponseDTO(
                t.getId(),
                t.getTransferCode(),
                t.getSourceBase().getId(),
                t.getSourceBase().getName(),
                t.getDestinationBase().getId(),
                t.getDestinationBase().getName(),
                t.getEquipmentType().getId(),
                t.getEquipmentType().getName(),
                t.getQuantity(),
                t.getStatus(),
                t.getNotes(),
                t.getRequestedBy() != null ? t.getRequestedBy().getUsername() : "System",
                t.getApprovedBy() != null ? t.getApprovedBy().getUsername() : null,
                t.getCreatedAt(),
                t.getUpdatedAt()
        );
    }
}
