package org.melekhov.buffhp.services.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.melekhov.buffhp.dtos.AppointmentDto;
import org.melekhov.buffhp.dtos.MedicalRecordDto;
import org.melekhov.buffhp.dtos.PrescriptionDto;
import org.melekhov.buffhp.dtos.PrescriptionResponseDto;
import org.melekhov.buffhp.entities.Doctor;
import org.melekhov.buffhp.entities.Patient;
import org.melekhov.buffhp.entities.User;
import org.melekhov.buffhp.mappers.*;
import org.melekhov.buffhp.repositories.*;
import org.melekhov.buffhp.services.UserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final ProfileMapper profileMapper;

    private final DoctorMapper doctorMapper;
    private final PrescriptionMapper prescriptionMapper;
    private final AppointmentMapper appointmentMapper;
    private final MedicalRecordMapper medicalRecordMapper;

    @Override
    public Object getUserProfile(UUID userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (user.getPatient() != null) {
            Patient patient = patientRepository.findByUserId(userId)
                    .orElseThrow(() -> new EntityNotFoundException("Patient not found"));

            List<AppointmentDto> appointmentDtoList = appointmentRepository.findByPatientId(patient.getPatientId())
                    .stream()
                    .map(appointmentMapper::toDto)
                    .toList();

            List<MedicalRecordDto> medicalRecordDtoList = medicalRecordRepository.findByPatientId(patient.getPatientId())
                    .stream()
                    .map(medicalRecordMapper::toMedicalRecordDto)
                    .toList();

            List<PrescriptionResponseDto> prescriptionDtoList = prescriptionRepository.findByPatientId(patient.getPatientId())
                    .stream()
                    .map(prescriptionMapper::mapToResponse)
                    .toList();

            return profileMapper.toDto(patient, appointmentDtoList, medicalRecordDtoList, prescriptionDtoList);
        } else if (user.getDoctor() != null) {
            Doctor doctor = doctorRepository.findByUserId(userId)
                    .orElseThrow(() -> new EntityNotFoundException("Doctor not found"));

            List<AppointmentDto> appointmentDtoList = appointmentRepository.findByDoctorId(doctor.getDoctorId())
                    .stream()
                    .map(appointmentMapper::toDto)
                    .toList();

            List<PrescriptionResponseDto> prescriptionDtoList = prescriptionRepository.findByDoctorId(doctor.getDoctorId())
                    .stream()
                    .map(prescriptionMapper::mapToResponse)
                    .toList();

            return profileMapper.toDto(doctor, appointmentDtoList, prescriptionDtoList);
        }

        return user;
    }
}
