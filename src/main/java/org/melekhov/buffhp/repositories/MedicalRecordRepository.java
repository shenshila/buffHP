package org.melekhov.buffhp.repositories;

import org.melekhov.buffhp.dtos.DiagnosisDistributionDto;
import org.melekhov.buffhp.dtos.DiseaseCountByDateDto;
import org.melekhov.buffhp.entities.MedicalRecord;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, UUID> {
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.patient.patientId = :patientId")
    List<MedicalRecord> findByPatientId(@Param("patientId") UUID patientId);

    // 1. Динамика заболеваемости по времени (по месяцам)
    @Query("SELECT new org.melekhov.buffhp.dtos.DiseaseCountByDateDto(mr.diagnosis, " +
            "CAST(DATE_TRUNC('month', mr.recordDate) AS LocalDate), COUNT(mr)) " +
            "FROM MedicalRecord mr " +
            "WHERE mr.recordDate BETWEEN :startDate AND :endDate " +
            "GROUP BY mr.diagnosis, DATE_TRUNC('month', mr.recordDate) " +
            "ORDER BY mr.diagnosis, DATE_TRUNC('month', mr.recordDate)")
    List<DiseaseCountByDateDto> countDiseasesByMonth(@Param("startDate") LocalDate startDate,
                                                     @Param("endDate") LocalDate endDate);

    // 2. Распределение диагнозов (топ N)
    @Query(value = "SELECT new org.melekhov.buffhp.dtos.DiagnosisDistributionDto(mr.diagnosis, COUNT(mr)) " +
            "FROM MedicalRecord mr " +
            "WHERE mr.recordDate BETWEEN :startDate AND :endDate " +
            "GROUP BY mr.diagnosis " +
            "ORDER BY COUNT(mr) DESC")
    List<DiagnosisDistributionDto> countTopDiagnoses(@Param("startDate") LocalDate startDate,
                                                     @Param("endDate") LocalDate endDate);

//    // Пример запроса для подсчета диагнозов по месяцам
//    @Query("SELECT new com.example.medicalapp.dto.DiagnosisCountByMonthDto(" +
//            "  FUNCTION('FORMAT', mr.recordDate, 'yyyy-MM'), " + // MySQL/H2: DATE_FORMAT(mr.recordDate, '%Y-%m')
//            // Для PostgreSQL: TO_CHAR(mr.recordDate, 'YYYY-MM')
//            "  mr.diagnosis, " +
//            "  COUNT(mr.medicalRecordId)) " +
//            "FROM MedicalRecord mr " +
//            "WHERE mr.recordDate BETWEEN :startDate AND :endDate " +
//            "GROUP BY FUNCTION('FORMAT', mr.recordDate, 'yyyy-MM'), mr.diagnosis " +
//            "ORDER BY FUNCTION('FORMAT', mr.recordDate, 'yyyy-MM'), mr.diagnosis")
//    List<DiseaseCountByDateDto> countDiagnosisByMonth(LocalDate startDate, LocalDate endDate);

    @Override
    @EntityGraph(attributePaths = {"patient"}) // Для избежания N+1
    Optional<MedicalRecord> findById(UUID id);

}
