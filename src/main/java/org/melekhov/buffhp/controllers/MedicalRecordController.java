package org.melekhov.buffhp.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.melekhov.buffhp.dtos.MedicalRecordRequestDto;
import org.melekhov.buffhp.dtos.MedicalRecordResponseDto;
import org.melekhov.buffhp.services.MedicalRecordService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/medical-records")
@Slf4j
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class MedicalRecordController {
    private final MedicalRecordService medicalRecordService;

    @PreAuthorize("hasRole('DOCTOR') or (hasRole('PATIENT') and @patientSecurity.isOwner(#patientId))")
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicalRecordResponseDto>> getMedicalRecordsForPatient(@PathVariable UUID patientId) {
        List<MedicalRecordResponseDto> records = medicalRecordService.getMedicalRecordsByPatientId(patientId);
        return ResponseEntity.ok(records);
    }

    @PreAuthorize("hasRole('DOCTOR') or (hasRole('PATIENT') and @patientSecurity.isRecordOwner(#recordId))")
    @GetMapping("/{recordId}")
    public ResponseEntity<MedicalRecordResponseDto> getMedicalRecordById(@PathVariable UUID recordId) {
        MedicalRecordResponseDto record = medicalRecordService.getMedicalRecordById(recordId);
        return ResponseEntity.ok(record);
    }

    @PreAuthorize("hasRole('DOCTOR')")
    @PostMapping
    public ResponseEntity<MedicalRecordResponseDto> createMedicalRecord(@Valid @RequestBody MedicalRecordRequestDto requestDto) {
        MedicalRecordResponseDto newRecord = medicalRecordService.createMedicalRecord(requestDto);
        return new ResponseEntity<>(newRecord, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('DOCTOR')")
    @PutMapping("/{recordId}")
    public ResponseEntity<MedicalRecordResponseDto> updateMedicalRecord(@PathVariable UUID recordId,
                                                                        @Valid @RequestBody MedicalRecordRequestDto requestDto) {
        MedicalRecordResponseDto updatedRecord = medicalRecordService.updateMedicalRecord(recordId, requestDto);
        return ResponseEntity.ok(updatedRecord);
    }

    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    @DeleteMapping("/{recordId}")
    public ResponseEntity<Void> deleteMedicalRecord(@PathVariable UUID recordId) {
        medicalRecordService.deleteMedicalRecord(recordId);
        return ResponseEntity.noContent().build();
    }
}
