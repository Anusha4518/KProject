package com.military.assetmanagement.service;

import com.military.assetmanagement.audit.Auditable;
import com.military.assetmanagement.dto.AssignmentRequestDTO;
import com.military.assetmanagement.dto.AssignmentResponseDTO;
import com.military.assetmanagement.dto.ExpenditureRequestDTO;
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
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final BaseRepository baseRepository;
    private final EquipmentTypeRepository equipmentTypeRepository;
    private final AssetBalanceRepository assetBalanceRepository;
    private final UserRepository userRepository;

    public AssignmentService(AssignmentRepository assignmentRepository,
                             BaseRepository baseRepository,
                             EquipmentTypeRepository equipmentTypeRepository,
                             AssetBalanceRepository assetBalanceRepository,
                             UserRepository userRepository) {
        this.assignmentRepository = assignmentRepository;
        this.baseRepository = baseRepository;
        this.equipmentTypeRepository = equipmentTypeRepository;
        this.assetBalanceRepository = assetBalanceRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    @Auditable(actionType = "ASSET_ASSIGNED", entityType = "Assignment")
    public AssignmentResponseDTO createAssignment(AssignmentRequestDTO request) {
        Base base = baseRepository.findById(request.getBaseId())
                .orElseThrow(() -> new RuntimeException("Base not found: " + request.getBaseId()));

        EquipmentType equipmentType = equipmentTypeRepository.findById(request.getEquipmentTypeId())
                .orElseThrow(() -> new RuntimeException("Equipment Type not found: " + request.getEquipmentTypeId()));

        AssetBalance balance = assetBalanceRepository.findByBaseIdAndEquipmentTypeId(base.getId(), equipmentType.getId())
                .orElseThrow(() -> new RuntimeException("Base has no stock of " + equipmentType.getName()));

        if (balance.getClosingBalance() < request.getQuantity()) {
            throw new RuntimeException("Insufficient closing stock for assignment. Available: " + balance.getClosingBalance());
        }

        User currentUser = getCurrentUser();
        String code = "ASN-" + LocalDateTime.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        Assignment assignment = new Assignment();
        assignment.setAssignmentCode(code);
        assignment.setBase(base);
        assignment.setEquipmentType(equipmentType);
        assignment.setPersonnelName(request.getPersonnelName());
        assignment.setPersonnelRank(request.getPersonnelRank());
        assignment.setQuantity(request.getQuantity());
        assignment.setType(AssignmentType.ASSIGNMENT);
        assignment.setStatus(AssignmentStatus.ACTIVE);
        assignment.setNotes(request.getNotes());
        assignment.setCreatedBy(currentUser);
        assignment.setTimestamp(LocalDateTime.now());

        Assignment saved = assignmentRepository.save(assignment);

        balance.setAssignedQuantity(balance.getAssignedQuantity() + request.getQuantity());
        assetBalanceRepository.save(balance);

        return mapToDTO(saved);
    }

    @Transactional
    @Auditable(actionType = "ASSET_EXPENDED", entityType = "Assignment")
    public AssignmentResponseDTO recordExpenditure(ExpenditureRequestDTO request) {
        Base base = baseRepository.findById(request.getBaseId())
                .orElseThrow(() -> new RuntimeException("Base not found: " + request.getBaseId()));

        EquipmentType equipmentType = equipmentTypeRepository.findById(request.getEquipmentTypeId())
                .orElseThrow(() -> new RuntimeException("Equipment Type not found: " + request.getEquipmentTypeId()));

        AssetBalance balance = assetBalanceRepository.findByBaseIdAndEquipmentTypeId(base.getId(), equipmentType.getId())
                .orElseThrow(() -> new RuntimeException("Base has no stock of " + equipmentType.getName()));

        if (balance.getClosingBalance() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock to record expenditure. Available: " + balance.getClosingBalance());
        }

        User currentUser = getCurrentUser();
        String code = "EXP-" + LocalDateTime.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        Assignment expenditure = new Assignment();
        expenditure.setAssignmentCode(code);
        expenditure.setBase(base);
        expenditure.setEquipmentType(equipmentType);
        expenditure.setPersonnelName(request.getOperationName() != null ? request.getOperationName() : "Operational Exercise");
        expenditure.setPersonnelRank(request.getUnitSection() != null ? request.getUnitSection() : "Field Unit");
        expenditure.setQuantity(request.getQuantity());
        expenditure.setType(AssignmentType.EXPENDITURE);
        expenditure.setStatus(AssignmentStatus.EXPENDED);
        expenditure.setNotes(request.getNotes());
        expenditure.setCreatedBy(currentUser);
        expenditure.setTimestamp(LocalDateTime.now());

        Assignment saved = assignmentRepository.save(expenditure);

        balance.setClosingBalance(balance.getClosingBalance() - request.getQuantity());
        balance.setExpendedQuantity(balance.getExpendedQuantity() + request.getQuantity());
        assetBalanceRepository.save(balance);

        return mapToDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<AssignmentResponseDTO> getAssignments(Long baseId, Long equipmentTypeId, AssignmentType type, LocalDateTime startDate, LocalDateTime endDate) {
        return assignmentRepository.filterAssignments(baseId, equipmentTypeId, type, startDate, endDate).stream()
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

    private AssignmentResponseDTO mapToDTO(Assignment a) {
        return new AssignmentResponseDTO(
                a.getId(),
                a.getAssignmentCode(),
                a.getBase().getId(),
                a.getBase().getName(),
                a.getEquipmentType().getId(),
                a.getEquipmentType().getName(),
                a.getPersonnelName(),
                a.getPersonnelRank(),
                a.getQuantity(),
                a.getType(),
                a.getStatus(),
                a.getNotes(),
                a.getCreatedBy() != null ? a.getCreatedBy().getUsername() : "System",
                a.getTimestamp()
        );
    }
}
