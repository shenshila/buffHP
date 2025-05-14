package org.melekhov.buffhp.mappers;

import lombok.extern.slf4j.Slf4j;
import org.melekhov.buffhp.dtos.PatientDto;
import org.melekhov.buffhp.dtos.RegistrationRequestDto;
import org.melekhov.buffhp.entities.Patient;
import org.melekhov.buffhp.entities.User;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@Slf4j
public class PatientMapper {
    public PatientDto toDto(Patient patient) {
//        log.info("Converting patient to PatientDto...");
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

    public Patient toEntity(RegistrationRequestDto request, User user) {
//        log.info("Converting patientDTO to Patient...");

        return Patient.builder()
                .firstName(request.getFirstName())
                .middleName(request.getMiddleName())
                .lastName(request.getLastName())
                .birthDate(request.getBirthDate())
                .gender(request.getGender())
                .phone(request.getPhone())
                .insuranceNumber(request.getInsuranceNumber())
                .user(user)
                .build();
    }
}
