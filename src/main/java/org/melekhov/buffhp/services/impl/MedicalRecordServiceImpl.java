package org.melekhov.buffhp.services.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.melekhov.buffhp.dtos.MedicalRecordRequestDto;
import org.melekhov.buffhp.dtos.MedicalRecordResponseDto;
import org.melekhov.buffhp.entities.MedicalRecord;
import org.melekhov.buffhp.entities.Patient;
import org.melekhov.buffhp.handler.GlobalExceptionHandler;
import org.melekhov.buffhp.repositories.MedicalRecordRepository;
import org.melekhov.buffhp.repositories.PatientRepository;
import org.melekhov.buffhp.services.MedicalRecordService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class MedicalRecordServiceImpl implements MedicalRecordService {
    private final MedicalRecordRepository medicalRecordRepository;
    private final PatientRepository patientRepository;

    @Override
    public List<MedicalRecordResponseDto> getMedicalRecordsByPatientId(UUID patientId) {
        patientRepository.findById(patientId)
                .orElseThrow(() -> new GlobalExceptionHandler.ResourceNotFoundException("Patient not found with ID: " + patientId));

        return medicalRecordRepository.findByPatient_PatientIdOrderByRecordDateDesc(patientId)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public MedicalRecordResponseDto getMedicalRecordById(UUID recordId) {
        MedicalRecord medicalRecord = medicalRecordRepository.findById(recordId)
                .orElseThrow(() -> new GlobalExceptionHandler.ResourceNotFoundException("Medical record not found with ID: " + recordId));

        return mapToResponseDto(medicalRecord);
    }

    @Override
    @Transactional
    public MedicalRecordResponseDto createMedicalRecord(MedicalRecordRequestDto requestDto) {
        Patient patient = patientRepository.findById(requestDto.getPatientId())
                .orElseThrow(() -> new GlobalExceptionHandler.ResourceNotFoundException("Patient not found with ID: " + requestDto.getPatientId()));

        MedicalRecord medicalRecord = MedicalRecord.builder()
                .patient(patient)
                .recordDate(requestDto.getRecordDate())
                .diagnosis(requestDto.getDiagnosis())
                .treatment(requestDto.getTreatment())
                .symptoms(requestDto.getSymptoms())
                .source(requestDto.getSource() != null ? requestDto.getSource() : "Doctor")
                .build();

        MedicalRecord savedMedicalRecord = medicalRecordRepository.save(medicalRecord);
        return mapToResponseDto(savedMedicalRecord);
    }

    @Override
    @Transactional
    public MedicalRecordResponseDto updateMedicalRecord(UUID recordId, MedicalRecordRequestDto requestDto) {
        MedicalRecord existingRecord = medicalRecordRepository.findById(recordId)
                .orElseThrow(() -> new GlobalExceptionHandler.ResourceNotFoundException("Medical record not found with ID: " + recordId));

        if (!existingRecord.getPatient().getPatientId().equals(requestDto.getPatientId())) {
            throw new IllegalArgumentException("Cannot change patient for an existing medical record.");
        }

        existingRecord.setRecordDate(requestDto.getRecordDate());
        existingRecord.setDiagnosis(requestDto.getDiagnosis());
        existingRecord.setTreatment(requestDto.getTreatment());
        existingRecord.setSymptoms(requestDto.getSymptoms());
        existingRecord.setSource(requestDto.getSource() != null ? requestDto.getSource() : existingRecord.getSource());

        MedicalRecord updatedRecord = medicalRecordRepository.save(existingRecord);
        return mapToResponseDto(updatedRecord);
    }

    @Override
    @Transactional
    public void deleteMedicalRecord(UUID recordId) {
        if (!medicalRecordRepository.existsById(recordId)) {
            throw new GlobalExceptionHandler.ResourceNotFoundException("Medical Record not found with ID: " + recordId);
        }
        medicalRecordRepository.deleteById(recordId);
    }

    @Override
    public MedicalRecordResponseDto mapToResponseDto(MedicalRecord medicalRecord) {
        return new MedicalRecordResponseDto(
                medicalRecord.getMedicalRecordId(),
                medicalRecord.getPatient().getPatientId(),
                medicalRecord.getPatient().getFirstName(),
                medicalRecord.getPatient().getLastName(),
                medicalRecord.getRecordDate(),
                medicalRecord.getDiagnosis(),
                medicalRecord.getTreatment(),
                medicalRecord.getSymptoms(),
                medicalRecord.getSource(),
                medicalRecord.getVersion()
        );
    }
}
