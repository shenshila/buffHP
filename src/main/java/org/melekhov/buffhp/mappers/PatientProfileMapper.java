package org.melekhov.buffhp.mappers;

import lombok.extern.slf4j.Slf4j;
import org.melekhov.buffhp.dtos.AppointmentDto;
import org.melekhov.buffhp.dtos.MedicalRecordDto;
import org.melekhov.buffhp.dtos.PatientProfileDto;
import org.melekhov.buffhp.dtos.PrescriptionDto;
import org.melekhov.buffhp.entities.Appointment;
import org.melekhov.buffhp.entities.Patient;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
public class PatientProfileMapper {
    public PatientProfileDto toDto(Patient patient,
                                   List<AppointmentDto> appointments,
                                   List<MedicalRecordDto> medicalRecords,
                                   List<PrescriptionDto> prescriptions) {
        PatientProfileDto patientProfileDto = PatientProfileDto.builder()
                .id(patient.getPatientId())
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .middleName(patient.getMiddleName())
                .dateOfBirth(patient.getBirthDate())
                .gender(patient.getGender())
                .phone(patient.getPhone())
                .insuranceNumber(patient.getInsuranceNumber())
                .appointments(appointments)
                .medicalRecords(medicalRecords)
                .prescriptions(prescriptions)
                .build();

        return patientProfileDto;
    }
}
