package org.melekhov.buffhp.services;

import org.melekhov.buffhp.dtos.MedicalRecordRequestDto;
import org.melekhov.buffhp.dtos.MedicalRecordResponseDto;
import org.melekhov.buffhp.entities.MedicalRecord;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface MedicalRecordService {
    List<MedicalRecordResponseDto> getMedicalRecordsByPatientId(UUID patientId);
    MedicalRecordResponseDto getMedicalRecordById(UUID recordId);
    MedicalRecordResponseDto createMedicalRecord(MedicalRecordRequestDto requestDto);
    MedicalRecordResponseDto updateMedicalRecord(UUID recordId, MedicalRecordRequestDto requestDto);
    void deleteMedicalRecord(UUID recordId);
    MedicalRecordResponseDto mapToResponseDto(MedicalRecord medicalRecord);
}
