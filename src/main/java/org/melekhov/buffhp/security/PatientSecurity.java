package org.melekhov.buffhp.security;

import lombok.RequiredArgsConstructor;
import org.melekhov.buffhp.entities.MedicalRecord;
import org.melekhov.buffhp.entities.Patient;
import org.melekhov.buffhp.repositories.MedicalRecordRepository;
import org.melekhov.buffhp.repositories.PatientRepository;
import org.springframework.stereotype.Component;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.UUID;
import java.util.Optional;

@Component("patientSecurity")
@RequiredArgsConstructor
public class PatientSecurity {
    private final PatientRepository patientRepository;
    private final MedicalRecordRepository medicalRecordRepository;

    public boolean isOwner(UUID patientId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            return false;
        }
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();

        Optional<Patient> patientOpt = patientRepository.findByUserEmail(username);
        return patientOpt.map(patient -> patient.getPatientId().equals(patientId)).orElse(false);
    }

    public boolean isRecordOwner(UUID recordId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            return false;
        }
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();

        Optional<Patient> patientOpt = patientRepository.findByUserEmail(username);
        if (patientOpt.isEmpty()) {
            return false;
        }
        UUID currentPatientId = patientOpt.get().getPatientId();

        Optional<MedicalRecord> recordOpt = medicalRecordRepository.findById(recordId);
        return recordOpt.map(record -> record.getPatient().getPatientId().equals(currentPatientId)).orElse(false);
    }

}
