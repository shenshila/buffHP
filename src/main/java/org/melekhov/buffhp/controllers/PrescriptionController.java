package org.melekhov.buffhp.controllers;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.melekhov.buffhp.dtos.PrescriptionRequestDto;
import org.melekhov.buffhp.dtos.PrescriptionResponseDto;
import org.melekhov.buffhp.dtos.PrescriptionVerificationResult;
import org.melekhov.buffhp.entities.Doctor;
import org.melekhov.buffhp.repositories.DoctorRepository;
import org.melekhov.buffhp.services.PrescriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Controller
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {
    private final PrescriptionService prescriptionService;
    private final DoctorRepository doctorRepository;

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<PrescriptionResponseDto> createPrescription(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody PrescriptionRequestDto requestDto) {
        UUID doctorId = getCurrentDoctorId(userDetails);
        PrescriptionResponseDto response = prescriptionService.createPrescription(doctorId, requestDto);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/verify/{code}")
    public ResponseEntity<PrescriptionVerificationResult> verifyPrescription(
            @PathVariable String code) {
        PrescriptionVerificationResult result = prescriptionService.verifyPrescription(code);
        return ResponseEntity.ok(result);
    }

    private UUID getCurrentDoctorId(UserDetails userDetails) {
        String email = userDetails.getUsername();
        Doctor doctor = doctorRepository.findByUserEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found"));
        return doctor.getDoctorId();
    }
}
