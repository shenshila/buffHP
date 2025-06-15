package org.melekhov.buffhp.mappers;

import lombok.RequiredArgsConstructor;
import org.melekhov.buffhp.dtos.PrescriptionDto;
import org.melekhov.buffhp.dtos.PrescriptionResponseDto;
import org.melekhov.buffhp.entities.Prescription;
import org.springframework.stereotype.Component;

import java.util.Base64;

@Component
@RequiredArgsConstructor
public class PrescriptionMapper {
    private final DoctorMapper doctorMapper;
    private final PatientMapper patientMapper;

    public PrescriptionDto toDto(Prescription prescription) {

        return PrescriptionDto.builder()
                .id(prescription.getPrescriptionId())
                .patient(patientMapper.toDto(prescription.getPatient()))
                .doctor(doctorMapper.toDoctorDto(prescription.getDoctor()))
                .issueDate(prescription.getIssueDate())
                .expiryDate(prescription.getExpiryDate())
                .medication(prescription.getMedication())
                .dosage(prescription.getDosage())
                .instructions(prescription.getInstructions())
                .build();
    }

    public PrescriptionResponseDto mapToResponse(Prescription prescription) {
        if (prescription == null) {
            return null;
        }

        String qrCodeBase64String = null;
        if (prescription.getQrCode() != null && prescription.getQrCode().length > 0) {
            qrCodeBase64String = Base64.getEncoder().encodeToString(prescription.getQrCode());
        }

        return PrescriptionResponseDto.builder()
                .id(prescription.getPrescriptionId())
                .patientName(patientMapper.toDto(prescription.getPatient()))
                .doctorName(doctorMapper.toDoctorDto(prescription.getDoctor()))
                .issueDate(prescription.getIssueDate())
                .expiryDate(prescription.getExpiryDate())
                .medication(prescription.getMedication())
                .dosage(prescription.getDosage())
                .instructions(prescription.getInstructions())
                .verificationCode(prescription.getVerificationCode())
                .verificationUrl("http://localhost:8080/api/prescriptions/verify/" + prescription.getVerificationCode())
                .qrCodeBase64(qrCodeBase64String)
                .build();
    }
}
