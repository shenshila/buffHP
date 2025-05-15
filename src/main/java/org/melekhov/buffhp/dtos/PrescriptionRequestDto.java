package org.melekhov.buffhp.dtos;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class PrescriptionRequestDto {
    private UUID patientId;
    private String medication;
    private String dosage;
    private String instructions;
    private int validityDays;
}
