package org.melekhov.buffhp.mappers;

import lombok.RequiredArgsConstructor;
import org.melekhov.buffhp.dtos.PrescriptionDto;
import org.melekhov.buffhp.entities.Prescription;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PrescriptionMapper {
    private final DoctorMapper doctorMapper;
    private final PatientMapper patientMapper;

    public PrescriptionDto toDto(Prescription prescription) {

        return PrescriptionDto.builder()
                .patient(patientMapper.toDto(prescription.getPatient()))
                .doctor(doctorMapper.toDoctorDto(prescription.getDoctor()))
                .issueDate(prescription.getIssueDate())
                .expiryDate(prescription.getExpiryDate())
                .medication(prescription.getMedication())
                .dosage(prescription.getDosage())
                .instructions(prescription.getInstructions())
                .build();
    }
}
