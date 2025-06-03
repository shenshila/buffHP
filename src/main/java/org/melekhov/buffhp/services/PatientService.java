package org.melekhov.buffhp.services;

import org.melekhov.buffhp.dtos.MedicalRecordRequestDto;
import org.melekhov.buffhp.dtos.MedicalRecordResponseDto;
import org.melekhov.buffhp.dtos.PatientDto;
import org.melekhov.buffhp.dtos.UserProfileDto;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public interface PatientService {

    List<PatientDto> universalSearch(String keyword);

    List<PatientDto> filterPatients(String gender, LocalDate startDate, LocalDate endDate);

    UserProfileDto getPatientProfile(UUID id);

    void saveRecordFromAi(UUID patientId, String symptoms, String aiResponse); // Твой существующий метод

//    MedicalRecordResponseDto createMedicalRecord(UUID patientId, MedicalRecordRequestDto requestDto);
//    MedicalRecordResponseDto updateMedicalRecord(UUID recordId, MedicalRecordRequestDto requestDto);
//    void deleteMedicalRecord(UUID recordId);
//    MedicalRecordResponseDto getMedicalRecordById(UUID recordId);
//    List<MedicalRecordResponseDto> getMedicalRecordsByPatientId(UUID patientId); // Ты уже получаешь их через UserProfileDto, но этот метод может быть полезен для отдельного API или обновления списка
    // no using
//    List<PatientDto> searchPatient(String keyword);

//    PatientDto findByInsuranceNumber(String insuranceNumber);
}
