package org.melekhov.buffhp.dtos;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class PrescriptionDto {
    private UUID id;
    private PatientDto patient;
    private DoctorDto doctor;
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private String medication;
    private String dosage;
    private String instructions;
}
