package org.melekhov.buffhp.controllers;

import lombok.RequiredArgsConstructor;
import org.melekhov.buffhp.dtos.DiagnosisDistributionDto;
import org.melekhov.buffhp.dtos.DiseaseCountByDateDto;
import org.melekhov.buffhp.services.AnalyticsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    @PreAuthorize("hasRole('DOCTOR')")
    @GetMapping("/disease-trends")
    public ResponseEntity<List<DiseaseCountByDateDto>> getDiseaseTrends(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<DiseaseCountByDateDto> trends = analyticsService.getDiseaseTrends(startDate, endDate);
        return ResponseEntity.ok(trends);
    }

    @PreAuthorize("hasRole('DOCTOR')")
    @GetMapping("/top-diagnoses")
    public ResponseEntity<List<DiagnosisDistributionDto>> getTopDiagnoses(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "10") int limit) {
        List<DiagnosisDistributionDto> topDiagnoses = analyticsService.getTopDiagnoses(startDate, endDate, limit);
        return ResponseEntity.ok(topDiagnoses);
    }
}
