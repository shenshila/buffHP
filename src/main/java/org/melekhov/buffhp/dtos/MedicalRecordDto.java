package org.melekhov.buffhp.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.melekhov.buffhp.entities.enums.MedicalRecordSource;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecordDto {

    private UUID id;
    private LocalDate recordDate;
    private PatientDto patient;
    private String diagnosis;
    private String treatment;
    private String symptoms;
    private MedicalRecordSource source;

    private String attachments;

}
