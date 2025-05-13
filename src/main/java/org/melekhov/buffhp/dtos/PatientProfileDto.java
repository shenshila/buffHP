package org.melekhov.buffhp.dtos;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class PatientProfileDto {
    private UUID id;
    private String firstName;
    private String lastName;
    private String middleName;
    private String gender;
    private LocalDate dateOfBirth;
    private String phone;
    private String insuranceNumber;

    private List<AppointmentDto> appointments;
    private List<MedicalRecordDto> medicalRecords;
    private List<PrescriptionDto> prescriptions;

}
