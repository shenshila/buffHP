package org.melekhov.buffhp.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.melekhov.buffhp.dtos.AppointmentRequestDto;
import org.melekhov.buffhp.dtos.AppointmentResponseDto;
import org.melekhov.buffhp.entities.Appointment;
import org.melekhov.buffhp.entities.Doctor;
import org.melekhov.buffhp.entities.Patient;
import org.melekhov.buffhp.repositories.AppointmentRepository;
import org.melekhov.buffhp.repositories.PatientRepository;
import org.melekhov.buffhp.services.AppointmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR')")
    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(appointmentService.getAllDoctors());
    }

    @PreAuthorize("hasRole('PATIENT')")
    @PostMapping    
    public ResponseEntity<AppointmentResponseDto> createAppointment(@AuthenticationPrincipal UserDetails userDetails,
                                                                    @Valid @RequestBody AppointmentRequestDto appointmentRequestDto) {
        UUID patientId = getCurrentPatientId(userDetails);
        appointmentRequestDto.setPatientId(patientId);

        AppointmentResponseDto newAppointment = appointmentService.createAppointment(appointmentRequestDto);
        return new ResponseEntity<>(newAppointment, HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR')")
    @DeleteMapping("/{appointmentId}")
    public ResponseEntity<Void> cancelAppointment(@AuthenticationPrincipal UserDetails userDetails,
                                                  @PathVariable UUID appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId).orElse(null);
        String userRole = userDetails.getAuthorities().stream().findFirst().get().getAuthority();

        if ("PATIENT".equals(userRole)) {
            UUID currentPatientId = getCurrentPatientId(userDetails);
            if (!appointment.getPatient().getPatientId().equals(currentPatientId)) {
                throw new AccessDeniedException("Вы не можете отменить чужую запись.");
            }
        }

        appointmentService.cancelAppointment(appointmentId);
        return ResponseEntity.noContent().build();
    }

    private UUID getCurrentPatientId(UserDetails userDetails) {
        String username = userDetails.getUsername();
        Patient patient = patientRepository.findByUserEmail(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException(username));

        return patient.getPatientId();
    }

}
