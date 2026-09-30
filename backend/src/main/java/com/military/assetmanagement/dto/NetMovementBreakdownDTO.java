package com.military.assetmanagement.dto;

import java.util.List;

public class NetMovementBreakdownDTO {
    private Integer totalNetMovement;
    private Integer totalPurchases;
    private Integer totalTransfersIn;
    private Integer totalTransfersOut;

    private List<MovementDetailDTO> purchaseLogs;
    private List<MovementDetailDTO> transfersInLogs;
    private List<MovementDetailDTO> transfersOutLogs;

    public NetMovementBreakdownDTO() {}

    public NetMovementBreakdownDTO(Integer totalNetMovement, Integer totalPurchases, Integer totalTransfersIn, Integer totalTransfersOut,
                                   List<MovementDetailDTO> purchaseLogs, List<MovementDetailDTO> transfersInLogs, List<MovementDetailDTO> transfersOutLogs) {
        this.totalNetMovement = totalNetMovement;
        this.totalPurchases = totalPurchases;
        this.totalTransfersIn = totalTransfersIn;
        this.totalTransfersOut = totalTransfersOut;
        this.purchaseLogs = purchaseLogs;
        this.transfersInLogs = transfersInLogs;
        this.transfersOutLogs = transfersOutLogs;
    }

    public Integer getTotalNetMovement() { return totalNetMovement; }
    public void setTotalNetMovement(Integer totalNetMovement) { this.totalNetMovement = totalNetMovement; }

    public Integer getTotalPurchases() { return totalPurchases; }
    public void setTotalPurchases(Integer totalPurchases) { this.totalPurchases = totalPurchases; }

    public Integer getTotalTransfersIn() { return totalTransfersIn; }
    public void setTotalTransfersIn(Integer totalTransfersIn) { this.totalTransfersIn = totalTransfersIn; }

    public Integer getTotalTransfersOut() { return totalTransfersOut; }
    public void setTotalTransfersOut(Integer totalTransfersOut) { this.totalTransfersOut = totalTransfersOut; }

    public List<MovementDetailDTO> getPurchaseLogs() { return purchaseLogs; }
    public void setPurchaseLogs(List<MovementDetailDTO> purchaseLogs) { this.purchaseLogs = purchaseLogs; }

    public List<MovementDetailDTO> getTransfersInLogs() { return transfersInLogs; }
    public void setTransfersInLogs(List<MovementDetailDTO> transfersInLogs) { this.transfersInLogs = transfersInLogs; }

    public List<MovementDetailDTO> getTransfersOutLogs() { return transfersOutLogs; }
    public void setTransfersOutLogs(List<MovementDetailDTO> transfersOutLogs) { this.transfersOutLogs = transfersOutLogs; }
}
