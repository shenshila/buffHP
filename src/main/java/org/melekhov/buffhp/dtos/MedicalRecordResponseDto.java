package org.melekhov.buffhp.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.melekhov.buffhp.entities.enums.MedicalRecordSource;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MedicalRecordResponseDto {
    private UUID medicalRecordId;
    private UUID patientId;
    private String patientFirstName;
    private String patientLastName;
    private LocalDate recordDate;
    private String diagnosis;
    private String treatment;
    private String symptoms;
    private MedicalRecordSource source;
    private Long version;

    private UUID confirmedByDoctorId;
    private String confirmedByDoctorFirstName;
    private String confirmedByDoctorLastName;
    private LocalDateTime confirmedDate;
}
