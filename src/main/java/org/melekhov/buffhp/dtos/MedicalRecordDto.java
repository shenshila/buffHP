package org.melekhov.buffhp.dtos;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class MedicalRecordDto {

    private UUID id;
    private LocalDate recordDate;
    private PatientDto patient;
    private String diagnosis;
    private String treatment;

    private String attachments;

}
