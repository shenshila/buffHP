package org.melekhov.buffhp.dtos;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class PrescriptionResponseDto {
    private UUID id;
    private PatientDto patientName;
    private DoctorDto doctorName;
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private String medication;
    private String dosage;
    private String instructions;
    private String verificationCode;
    private String verificationUrl; // URL для проверки
    private String qrCodeBase64; // QR-код в base64
}
