package org.melekhov.buffhp.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MedicalRecordRequestDto {
    @NotNull(message = "Patient ID is mandatory")
    private UUID patientId;
    @NotNull(message = "Record date is mandatory")
    private LocalDate recordDate;
    @NotBlank(message = "Diagnosis is mandatory")
    private String diagnosis;
    private String treatment;
    private String symptoms;
    private String source;

    private String attachments;
}
