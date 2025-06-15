package org.melekhov.buffhp.dtos;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class UserProfileDto {
    private UUID id;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;

    private List<AppointmentDto> appointments;
    private List<PrescriptionResponseDto> prescriptions;

    // Для доктора
    private String specialization;

    // Для пациента
    private String middleName;
    private LocalDate birthDate;
    private String gender;
    private String address;
    private String insuranceNumber;

    private List<MedicalRecordDto> medicalRecords;
}
