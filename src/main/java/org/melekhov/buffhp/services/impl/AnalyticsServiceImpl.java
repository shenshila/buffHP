package org.melekhov.buffhp.services.impl;

import lombok.RequiredArgsConstructor;
import org.melekhov.buffhp.dtos.DiagnosisDistributionDto;
import org.melekhov.buffhp.dtos.DiseaseCountByDateDto;
import org.melekhov.buffhp.repositories.DoctorRepository;
import org.melekhov.buffhp.repositories.MedicalRecordRepository;
import org.melekhov.buffhp.repositories.PatientRepository;
import org.melekhov.buffhp.services.AnalyticsService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final MedicalRecordRepository recordRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;


    @Override
    public List<DiseaseCountByDateDto> getDiseaseTrends(LocalDate startDate, LocalDate endDate) {
        return recordRepository.countDiseasesByMonth(startDate, endDate);
    }

    @Override
    public List<DiagnosisDistributionDto> getTopDiagnoses(LocalDate startDate, LocalDate endDate, int limit) {
        // Логика ограничения top N может быть здесь, если в JPQL это неудобно
        return recordRepository.countTopDiagnoses(startDate, endDate)
                .stream()
                .limit(limit)
                .collect(Collectors.toList());
    }

}
