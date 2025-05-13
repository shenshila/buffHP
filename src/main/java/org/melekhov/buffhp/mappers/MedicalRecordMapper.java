package org.melekhov.buffhp.mappers;

import lombok.RequiredArgsConstructor;
import org.melekhov.buffhp.dtos.MedicalRecordDto;
import org.melekhov.buffhp.entities.MedicalRecord;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MedicalRecordMapper {
    private final PatientMapper patientMapper;

    public MedicalRecordDto toMedicalRecordDto(MedicalRecord medicalRecord) {

        return MedicalRecordDto.builder()
                .id(medicalRecord.getMedicalRecordId())
                .patient(patientMapper.toDto(medicalRecord.getPatient()))
                .recordDate(medicalRecord.getRecordDate())
                .diagnosis(medicalRecord.getDiagnosis())
                .treatment(medicalRecord.getTreatment())
                .build();
    }
}
