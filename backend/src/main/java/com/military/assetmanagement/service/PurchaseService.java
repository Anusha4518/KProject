package com.military.assetmanagement.service;

import com.military.assetmanagement.audit.Auditable;
import com.military.assetmanagement.dto.PurchaseRequestDTO;
import com.military.assetmanagement.dto.PurchaseResponseDTO;
import com.military.assetmanagement.model.AssetBalance;
import com.military.assetmanagement.model.Base;
import com.military.assetmanagement.model.EquipmentType;
import com.military.assetmanagement.model.Purchase;
import com.military.assetmanagement.model.User;
import com.military.assetmanagement.repository.AssetBalanceRepository;
import com.military.assetmanagement.repository.BaseRepository;
import com.military.assetmanagement.repository.EquipmentTypeRepository;
import com.military.assetmanagement.repository.PurchaseRepository;
import com.military.assetmanagement.repository.UserRepository;
import com.military.assetmanagement.security.UserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final BaseRepository baseRepository;
    private final EquipmentTypeRepository equipmentTypeRepository;
    private final AssetBalanceRepository assetBalanceRepository;
    private final UserRepository userRepository;

    public PurchaseService(PurchaseRepository purchaseRepository,
                           BaseRepository baseRepository,
                           EquipmentTypeRepository equipmentTypeRepository,
                           AssetBalanceRepository assetBalanceRepository,
                           UserRepository userRepository) {
        this.purchaseRepository = purchaseRepository;
        this.baseRepository = baseRepository;
        this.equipmentTypeRepository = equipmentTypeRepository;
        this.assetBalanceRepository = assetBalanceRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    @Auditable(actionType = "PURCHASE_RECORDED", entityType = "Purchase")
    public PurchaseResponseDTO recordPurchase(PurchaseRequestDTO request) {
        Base base = baseRepository.findById(request.getBaseId())
                .orElseThrow(() -> new RuntimeException("Base not found: " + request.getBaseId()));

        EquipmentType equipmentType = equipmentTypeRepository.findById(request.getEquipmentTypeId())
                .orElseThrow(() -> new RuntimeException("Equipment Type not found: " + request.getEquipmentTypeId()));

        User currentUser = getCurrentUser();

        BigDecimal totalCost = request.getUnitCost().multiply(BigDecimal.valueOf(request.getQuantity()));
        String code = "PUR-" + LocalDateTime.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        LocalDateTime purchaseDate = LocalDateTime.now();
        if (request.getPurchaseDate() != null && !request.getPurchaseDate().isEmpty()) {
            try {
                purchaseDate = LocalDateTime.parse(request.getPurchaseDate(), DateTimeFormatter.ISO_DATE_TIME);
            } catch (Exception ignored) {}
        }

        Purchase purchase = new Purchase();
        purchase.setPurchaseCode(code);
        purchase.setBase(base);
        purchase.setEquipmentType(equipmentType);
        purchase.setQuantity(request.getQuantity());
        purchase.setUnitCost(request.getUnitCost());
        purchase.setTotalCost(totalCost);
        purchase.setSupplier(request.getSupplier());
        purchase.setPurchaseDate(purchaseDate);
        purchase.setCreatedBy(currentUser);

        Purchase saved = purchaseRepository.save(purchase);

        AssetBalance balance = assetBalanceRepository.findByBaseIdAndEquipmentTypeId(base.getId(), equipmentType.getId())
                .orElseGet(() -> {
                    AssetBalance ab = new AssetBalance();
                    ab.setBase(base);
                    ab.setEquipmentType(equipmentType);
                    ab.setOpeningBalance(0);
                    ab.setClosingBalance(0);
                    ab.setAssignedQuantity(0);
                    ab.setExpendedQuantity(0);
                    return ab;
                });

        balance.setClosingBalance(balance.getClosingBalance() + request.getQuantity());
        assetBalanceRepository.save(balance);

        return mapToDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<PurchaseResponseDTO> getPurchases(Long baseId, Long equipmentTypeId, LocalDateTime startDate, LocalDateTime endDate) {
        return purchaseRepository.filterPurchases(baseId, equipmentTypeId, startDate, endDate).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal principal) {
            return userRepository.findById(principal.getId()).orElse(null);
        }
        return null;
    }

    private PurchaseResponseDTO mapToDTO(Purchase p) {
        return new PurchaseResponseDTO(
                p.getId(),
                p.getPurchaseCode(),
                p.getBase().getId(),
                p.getBase().getName(),
                p.getEquipmentType().getId(),
                p.getEquipmentType().getName(),
                p.getEquipmentType().getCategory(),
                p.getQuantity(),
                p.getUnitCost(),
                p.getTotalCost(),
                p.getSupplier(),
                p.getPurchaseDate(),
                p.getCreatedBy() != null ? p.getCreatedBy().getUsername() : "System",
                p.getCreatedAt()
        );
    }
}
