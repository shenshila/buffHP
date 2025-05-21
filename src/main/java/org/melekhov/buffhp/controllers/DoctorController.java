package org.melekhov.buffhp.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.melekhov.buffhp.dtos.PatientDto;
import org.melekhov.buffhp.dtos.PatientProfileDto;
import org.melekhov.buffhp.dtos.UserProfileDto;
import org.melekhov.buffhp.entities.Patient;
import org.melekhov.buffhp.repositories.PatientRepository;
import org.melekhov.buffhp.services.PatientService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/patients")
@RequiredArgsConstructor
@Slf4j
public class DoctorController {

    private final PatientService patientService;
    private final PatientRepository patientRepository;

    @GetMapping("/{id}/profile")
    public ResponseEntity<UserProfileDto> getPatientProfile(@PathVariable UUID id) {
        UserProfileDto patientProfileDto = patientService.getPatientProfile(id);
        return ResponseEntity.ok().body(patientProfileDto);
    }

    @GetMapping("/search")
    public ResponseEntity<List<PatientDto>> searchPatients(@RequestParam String keyword) {
        List<PatientDto> patientDtoList = patientService.universalSearch(keyword);
        return ResponseEntity.ok(patientDtoList);
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
}
