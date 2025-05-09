package org.melekhov.buffhp.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.melekhov.buffhp.dtos.PatientDto;
import org.melekhov.buffhp.services.PatientService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("api/patients")
@RequiredArgsConstructor
@Slf4j
public class PatientController {

    private final PatientService patientService;

    @GetMapping("/search")
    public ResponseEntity<List<PatientDto>> searchPatients(@RequestParam String keyword) {
        // Если keyword похож на страховой номер (только цифры)
        if (keyword.matches("\\d+")) {
            PatientDto patient = patientService.findByInsuranceNumber(keyword);
            return ResponseEntity.ok(patient != null ? List.of(patient) : List.of());
        }
        // Иначе поиск по имени/фамилии
        return ResponseEntity.ok(patientService.searchPatient(keyword));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<PatientDto>> filterPatients(
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        log.info("Filtering patients - gender: {}, from: {}, to: {}", gender, startDate, endDate);
        List<PatientDto> patientDtoList = patientService.filterPatients(gender, startDate, endDate);
        return ResponseEntity.ok().body(patientDtoList);
    }

//    @PostMapping
//    public ResponseEntity<PatientDto> createPatient(@RequestBody PatientDto patientDto) {
//        PatientDto patientDto = patientService.createPatient;
//        return ResponseEntity.ok().body(patientDto);
//    }

}
