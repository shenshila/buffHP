package org.melekhov.buffhp.mappers;

import lombok.extern.slf4j.Slf4j;
import org.melekhov.buffhp.dtos.PatientDto;
import org.melekhov.buffhp.entities.Patient;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class PatientMapper {
    public PatientDto toDto(Patient patient) {
        log.info("Converting patient to PatientDto...");
        PatientDto patientDto = PatientDto.builder()
                .id(patient.getPatientId())
                .firstName(patient.getFirstName())
                .middleName(patient.getMiddleName())
                .lastName(patient.getLastName())
                .birthDate(patient.getBirthDate())
                .gender(patient.getGender())
                .phoneNumber(patient.getPhone())
                .insuranceNumber(patient.getInsuranceNumber())
                .build();

        return patientDto;
    }

    public Patient toEntity(PatientDto patientDto) {
        log.info("Converting patientDTO to Patient...");
        Patient patient = Patient.builder()
                .patientId(patientDto.getId())
                .firstName(patientDto.getFirstName())
                .middleName(patientDto.getMiddleName())
                .lastName(patientDto.getLastName())
                .birthDate(patientDto.getBirthDate())
                .gender(patientDto.getGender())
                .phone(patientDto.getPhoneNumber())
                .insuranceNumber(patientDto.getInsuranceNumber())
                .build();

        return patient;
    }
}
