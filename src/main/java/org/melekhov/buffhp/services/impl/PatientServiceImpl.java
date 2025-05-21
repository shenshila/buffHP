package org.melekhov.buffhp.services.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.melekhov.buffhp.dtos.*;
import org.melekhov.buffhp.entities.MedicalRecord;
import org.melekhov.buffhp.entities.Patient;
import org.melekhov.buffhp.handler.GlobalExceptionHandler;
import org.melekhov.buffhp.mappers.*;
import org.melekhov.buffhp.repositories.*;
import org.melekhov.buffhp.services.PatientService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final AppointmentRepository appointmentRepository;
    private final AIChatServiceImpl symptomAnalysisService;

    private final PatientMapper patientMapper;
    private final DoctorMapper doctorMapper;
    private final MedicalRecordMapper medicalRecordMapper;
    private final AppointmentMapper appointmentMapper;
    private final PrescriptionMapper prescriptionMapper;
    private final ProfileMapper profileMapper;

    @Override
    public List<PatientDto> universalSearch(String keyword) {
        return patientRepository.universalSearch(keyword)
                .stream()
                .map(patientMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<PatientDto> filterPatients(String gender, LocalDate startDate, LocalDate endDate) {
        if (gender != null && startDate != null && endDate != null) {
            return patientRepository.findByGenderAndBirthDateBetween(gender, startDate, endDate)
                    .stream()
                    .map(patientMapper::toDto)
                    .collect(Collectors.toList());
        } else if (gender != null) {
            return patientRepository.findByGender(gender)
                    .stream()
                    .map(patientMapper::toDto)
                    .collect(Collectors.toList());
        } else if (startDate != null && endDate != null) {
            return patientRepository.findByBirthDateBetween(startDate, endDate)
                    .stream()
                    .map(patientMapper::toDto)
                    .collect(Collectors.toList());
        }


        return List.of();
    }

    @Override
    public UserProfileDto getPatientProfile(UUID id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new GlobalExceptionHandler.ResourceNotFoundException("Patient not found"));

        List<AppointmentDto> appointmentDtoList = appointmentRepository.findByPatientId(id)
                .stream()
                .map(appointmentMapper::toDto)
                .toList();

        List<MedicalRecordDto> medicalRecordDtoList = medicalRecordRepository.findByPatientId(id)
                .stream()
                .map(medicalRecordMapper::toMedicalRecordDto)
                .toList();

        List<PrescriptionDto> prescriptionDtoList = prescriptionRepository.findByPatientId(id)
                .stream()
                .map(prescriptionMapper::toDto)
                .toList();

        return profileMapper.toDto(patient, appointmentDtoList, medicalRecordDtoList, prescriptionDtoList);
    }

    @Transactional
    public void saveRecordFromAi(UUID patientId, String symptoms, String aiResponse) {
        try {
            String[] parts = aiResponse.split("Лечение:");
            String diagnosis = parts[0].replace("Диагноз:", "").trim();
            String treatment = parts.length > 1 ? parts[1].trim() : "Нет рекомендаций";

            MedicalRecord record = MedicalRecord.builder()
                    .patient(patientRepository.getReferenceById(patientId)) // Используем getReferenceById
                    .recordDate(LocalDate.now())
                    .diagnosis(diagnosis + " Сгенерировано с ИИ")
                    .treatment(treatment)
                    .symptoms(symptoms)
                    .source("AI_CHAT")
                    .build();

            medicalRecordRepository.saveAndFlush(record); // Явное сохранение с flush
            log.info("Запись успешно сохранена для пациента {}", patientId);
        } catch (Exception e) {
            log.error("Ошибка при сохранении записи: {}", e.getMessage());
            throw e;
        }
    }

//    public void saveRecordFromAi(UUID patientId, String symptoms) {
//        String aiResponse = symptomAnalysisService.analyzeSymptoms(symptoms);
//
//        String[] parts = aiResponse.split("Лечение:");
//        String diagnosis = parts[0].replace("Диагноз:", "").trim();
//        String treatment = parts.length > 1 ? parts[1].trim() : "Нет рекомендаций";
//
//        MedicalRecord record = MedicalRecord.builder()
//                .medicalRecordId(UUID.randomUUID())
//                .patient(patientRepository.findById(patientId).orElseThrow())
//                .recordDate(LocalDate.now())
//                .diagnosis(diagnosis)
//                .treatment(treatment)
//                .build();
//
//        medicalRecordRepository.save(record);
//    }


//    public PatientDto createPatient(PatientDto requestDto) {
//        Patient patient = patientMapper.toEntity(requestDto);
//        Patient savedPatient = patientRepository.save(patient);
//
//        return patientMapper.toDto(savedPatient);
//    }

    //    @Override
//    public List<PatientDto> searchPatient(String keyword) {
//        return patientRepository
//                .searchByKeyword(keyword)
//                .stream()
//                .map(patientMapper::toDto)
//                .collect(Collectors.toList());
//    }

    //    @Override
//    public PatientDto findByInsuranceNumber(String insuranceNumber) {
//        Patient patient =  patientRepository.findByInsuranceNumber(insuranceNumber)
//                .orElseThrow(() -> new RuntimeException("Patient not found"));
//
//        return patientMapper.toDto(patient);
//    }
}
