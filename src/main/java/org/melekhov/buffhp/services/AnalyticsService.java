package org.melekhov.buffhp.services;

import org.melekhov.buffhp.dtos.DiagnosisDistributionDto;
import org.melekhov.buffhp.dtos.DiseaseCountByDateDto;

import java.time.LocalDate;
import java.util.List;

public interface AnalyticsService {

    List<DiseaseCountByDateDto> getDiseaseTrends(LocalDate startDate, LocalDate endDate);

    List<DiagnosisDistributionDto> getTopDiagnoses(LocalDate startDate, LocalDate endDate, int limit);

}
