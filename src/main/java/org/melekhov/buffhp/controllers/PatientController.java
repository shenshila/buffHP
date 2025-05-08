package org.melekhov.buffhp.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.melekhov.buffhp.dtos.PatientDto;
import org.melekhov.buffhp.services.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/patients")
@RequiredArgsConstructor
@Slf4j
public class PatientController {

    private final PatientService patientService;

    @GetMapping("/search")
    public ResponseEntity<List<PatientDto>> searchPatients(@RequestParam String keyword) {
        List<PatientDto> patientDtoList = patientService.searchPatient(keyword);
        log.info("Search patients: {}", patientDtoList);
        return ResponseEntity.ok().body(patientDtoList);
    }

//    @GetMapping("/filter")
//    public ResponseEntity<List<PatientDto>> filterPatients(@RequestParam String keyword) {
//        List<PatientDto> patientDtoList = patientService.searchPatient();
//        return ResponseEntity.ok().body();
//    }

    @GetMapping("/insurance/{number}")
    public ResponseEntity<PatientDto> insurancePatients(@PathVariable String number) {
        PatientDto patientDto = patientService.findByInsuranceNumber(number);
        return ResponseEntity.ok().body(patientDto);
    }

//    @PostMapping
//    public ResponseEntity<PatientDto> createPatient(@RequestBody PatientDto patientDto) {
//        PatientDto patientDto = patientService.createPatient;
//        return ResponseEntity.ok().body(patientDto);
//    }

}
