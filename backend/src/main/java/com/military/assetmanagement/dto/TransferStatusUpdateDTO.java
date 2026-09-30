package com.military.assetmanagement.dto;

import com.military.assetmanagement.model.TransferStatus;
import jakarta.validation.constraints.NotNull;

public class TransferStatusUpdateDTO {

    @NotNull(message = "Status is required")
    private TransferStatus status;

    private String notes;

    public TransferStatus getStatus() { return status; }
    public void setStatus(TransferStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
