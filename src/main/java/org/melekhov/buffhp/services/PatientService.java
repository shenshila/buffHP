package org.melekhov.buffhp.services;

import org.melekhov.buffhp.dtos.PatientDto;
import org.melekhov.buffhp.dtos.UserProfileDto;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public interface PatientService {

    List<PatientDto> universalSearch(String keyword);

    List<PatientDto> filterPatients(String gender, LocalDate startDate, LocalDate endDate);

    UserProfileDto getPatientProfile(UUID id);

    // no using
//    List<PatientDto> searchPatient(String keyword);

//    PatientDto findByInsuranceNumber(String insuranceNumber);
}
