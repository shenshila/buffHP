package org.melekhov.buffhp.services.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.melekhov.buffhp.dtos.PatientDto;
import org.melekhov.buffhp.entities.Patient;
import org.melekhov.buffhp.mappers.PatientMapper;
import org.melekhov.buffhp.repositories.PatientRepository;
import org.melekhov.buffhp.services.PatientService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final PatientMapper patientMapper;

    @Override
    public List<PatientDto> searchPatient(String keyword) {
        return patientRepository
                .searchByKeyword(keyword)
                .stream()
                .map(patientMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<Patient> filterPatients(String gender, LocalDate startDate, LocalDate endDate) {
        if (gender != null && startDate != null && endDate != null) {
            return patientRepository.findByGenderAndBirthDateBetween(gender, startDate, endDate);
        } else if (gender != null) {
            return patientRepository.findByGender(gender);
        } else if (startDate != null && endDate != null) {
            return patientRepository.findByBirthDateBetween(startDate, endDate);
        }

        return List.of();
    }

    @Override
    public PatientDto findByInsuranceNumber(String insuranceNumber) {
        Patient patient =  patientRepository.findByInsuranceNumber(insuranceNumber)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        return patientMapper.toDto(patient);
    }

    public PatientDto createPatient(PatientDto requestDto) {
        Patient patient = patientMapper.toEntity(requestDto);
        Patient savedPatient = patientRepository.save(patient);

        return patientMapper.toDto(savedPatient);
    }


}
