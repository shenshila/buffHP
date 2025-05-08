package org.melekhov.buffhp.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.melekhov.buffhp.dtos.PatientDto;
import org.melekhov.buffhp.entities.Patient;
import org.melekhov.buffhp.repositories.PatientRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public interface PatientService {

    List<PatientDto> searchPatient(String keyword);

    List<Patient> filterPatients(String gender, LocalDate startDate, LocalDate endDate);

    PatientDto findByInsuranceNumber(String insuranceNumber);
}
