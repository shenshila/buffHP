package org.melekhov.buffhp.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PrescriptionVerificationResult {
    private boolean valid;
    private String prescriptionId;
    private String patientName;
    private String doctorName;
    private String medication;
    private String dosage;
    private String instructions;
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private String statusMessage;
}
