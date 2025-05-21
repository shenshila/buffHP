package org.melekhov.buffhp.mappers;

import lombok.extern.slf4j.Slf4j;
import org.melekhov.buffhp.dtos.*;
import org.melekhov.buffhp.entities.Doctor;
import org.melekhov.buffhp.entities.Patient;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
public class ProfileMapper {
    public UserProfileDto toDto(Patient patient,
                                List<AppointmentDto> appointments,
                                List<MedicalRecordDto> medicalRecords,
                                List<PrescriptionDto> prescriptions) {

        return UserProfileDto.builder()
                .id(patient.getPatientId())
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .middleName(patient.getMiddleName())
                .birthDate(patient.getBirthDate())
                .gender(patient.getGender())
                .phoneNumber(patient.getPhone())
                .insuranceNumber(patient.getInsuranceNumber())
                .appointments(appointments)
                .medicalRecords(medicalRecords)
                .prescriptions(prescriptions)
                .build();
    }

    public UserProfileDto toDto(Doctor doctor,
                                List<AppointmentDto> appointments,
                                List<PrescriptionDto> prescriptions) {
        return UserProfileDto.builder()
                .id(doctor.getDoctorId())
                .firstName(doctor.getFirstName())
                .lastName(doctor.getLastName())
                .email(doctor.getEmail())
                .phoneNumber(doctor.getPhone())
                .appointments(appointments)
                .prescriptions(prescriptions)
                .build();
    }
}
