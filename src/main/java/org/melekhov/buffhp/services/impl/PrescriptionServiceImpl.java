package org.melekhov.buffhp.services.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.melekhov.buffhp.dtos.PrescriptionRequestDto;
import org.melekhov.buffhp.dtos.PrescriptionResponseDto;
import org.melekhov.buffhp.dtos.PrescriptionVerificationResult;
import org.melekhov.buffhp.entities.Doctor;
import org.melekhov.buffhp.entities.Patient;
import org.melekhov.buffhp.entities.Prescription;
import org.melekhov.buffhp.mappers.PrescriptionMapper;
import org.melekhov.buffhp.repositories.DoctorRepository;
import org.melekhov.buffhp.repositories.PatientRepository;
import org.melekhov.buffhp.repositories.PrescriptionRepository;
import org.melekhov.buffhp.services.PrescriptionService;
import org.melekhov.buffhp.util.QRCodeGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PrescriptionServiceImpl implements PrescriptionService {
    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final PrescriptionMapper prescriptionMapper;
    private final QRCodeGenerator qrCodeGenerator;

    @Override
    @Transactional
    public PrescriptionResponseDto createPrescription(UUID doctorId, PrescriptionRequestDto request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new EntityNotFoundException("Patient not found"));

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found"));

        Prescription prescription = new Prescription();
        prescription.setPatient(patient);
        prescription.setDoctor(doctor);
        prescription.setIssueDate(LocalDate.now());
        prescription.setExpiryDate(LocalDate.now().plusDays(request.getValidityDays()));
        prescription.setMedication(request.getMedication());
        prescription.setDosage(request.getDosage());
        prescription.setInstructions(request.getInstructions());

        String verificationCode = UUID.randomUUID().toString();
        prescription.setVerificationCode(verificationCode);

        String verificationUrl = "http://localhost:8080/api/prescriptions/verify/" + verificationCode;
        byte[] qrCode = qrCodeGenerator.generateQRCode(verificationUrl);
        prescription.setQrCode(qrCode);

        log.info("Saving prescription with verificationCode: {}", prescription.getVerificationCode());
        log.info("QR code length: {} bytes", prescription.getQrCode().length);
        prescription = prescriptionRepository.save(prescription);

        return prescriptionMapper.mapToResponse(prescription);
    }

    @Override
    public PrescriptionVerificationResult verifyPrescription(String verificationCode) {
        Prescription prescription = prescriptionRepository.findByVerificationCode(verificationCode)
                .orElseThrow(() -> new EntityNotFoundException("Рецепт не найден"));

        PrescriptionVerificationResult result = new PrescriptionVerificationResult();
        result.setPrescriptionId(prescription.getPrescriptionId().toString());
        result.setPatientName(prescription.getPatient().getFirstName() + " " + prescription.getPatient().getLastName());
        result.setDoctorName(prescription.getDoctor().getFirstName() + " " + prescription.getDoctor().getLastName());
        result.setMedication(prescription.getMedication());
        result.setDosage(prescription.getDosage());
        result.setInstructions(prescription.getInstructions());
        result.setIssueDate(prescription.getIssueDate());
        result.setExpiryDate(prescription.getExpiryDate());

        log.info("Prescription verification result: {}", result);

        LocalDate today = LocalDate.now();
        if (today.isAfter(prescription.getExpiryDate())) {
            result.setValid(false);
            result.setStatusMessage("Рецепт просрочен");
        } else {
            result.setValid(true);
            result.setStatusMessage("Рецепт действителен");
        }

        return result;
    }

}
