package org.melekhov.buffhp.services.impl;

import lombok.RequiredArgsConstructor;
import org.melekhov.buffhp.dtos.*;
import org.melekhov.buffhp.entities.Appointment;
import org.melekhov.buffhp.entities.Doctor;
import org.melekhov.buffhp.entities.Patient;
import org.melekhov.buffhp.entities.enums.AppointmentStatus;
import org.melekhov.buffhp.handler.GlobalExceptionHandler;
import org.melekhov.buffhp.mappers.DoctorMapper;
import org.melekhov.buffhp.repositories.AppointmentRepository;
import org.melekhov.buffhp.repositories.DoctorRepository;
import org.melekhov.buffhp.repositories.PatientRepository;
import org.melekhov.buffhp.services.AppointmentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    private final DoctorMapper doctorMapper;

    private static final int APPOINTMENT_DURATION_MINUTES = 30;
    private static final LocalTime WORK_START_TIME = LocalTime.of(9, 0);
    private static final LocalTime WORK_END_TIME = LocalTime.of(17, 0);

    @Override
    public List<DoctorDto> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(doctorMapper::toDoctorDto)
                .collect(Collectors.toList());
    }

    @Override
    public DoctorAvailableSlotsDto getAvailableSlots(UUID doctorId, LocalDate date) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new GlobalExceptionHandler.ResourceNotFoundException("Doctor not found with ID: " + doctorId));

        List<Appointment> existingAppointments = appointmentRepository
                .findByDoctorAndAppointmentDateTimeBetween(
                        doctor,
                        date.atStartOfDay(),
                        date.atTime(23, 59, 59)
                );

        Set<LocalTime> bookedTimes = existingAppointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.SCHEDULED)
                .map(a -> a.getAppointmentDateTime().toLocalTime())
                .collect(Collectors.toSet());

        List<LocalTime> allPossibleSlots = new ArrayList<>();
        LocalTime currentTime = WORK_START_TIME;
        while (currentTime.isBefore(WORK_END_TIME)) {
            allPossibleSlots.add(currentTime);
            currentTime = currentTime.plusMinutes(APPOINTMENT_DURATION_MINUTES);
        }

        List<LocalTime> availableTimes = allPossibleSlots.stream()
                .filter(slot -> !bookedTimes.contains(slot))
                .collect(Collectors.toList());

        return new DoctorAvailableSlotsDto(
                doctor.getDoctorId(),
                doctor.getFirstName(),
                doctor.getLastName(),
                doctor.getSpecialization(),
                date,
                availableTimes
        );
    }

    @Override
    @Transactional
    public AppointmentResponseDto createAppointment(UUID patientId, AppointmentRequestDto requestDto) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new GlobalExceptionHandler.ResourceNotFoundException("Patient not found with ID: " + patientId));
        Doctor doctor = doctorRepository.findById(requestDto.getDoctorId())
                .orElseThrow(() -> new GlobalExceptionHandler.ResourceNotFoundException("Doctor not found with ID: " + requestDto.getDoctorId()));

        if (requestDto.getAppointmentDateTime().isBefore(LocalDateTime.now())) {
            throw new GlobalExceptionHandler.AppointmentException("Невозможно записаться на прошедшее время.");
        }

        DayOfWeek day = requestDto.getAppointmentDateTime().getDayOfWeek();
        if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) {
            throw new GlobalExceptionHandler.AppointmentException("Запись возможна только с понедельника по пятницу.");
        }

        LocalTime time = requestDto.getAppointmentDateTime().toLocalTime();
        if (time.isBefore(LocalTime.of(9, 0)) || time.isAfter(LocalTime.of(17, 0))) {
            throw new GlobalExceptionHandler.AppointmentException("Запись возможна только с 09:00 до 17:00.");
        }

        boolean isSlotBooked = appointmentRepository.findByDoctorAndAppointmentDateTime(doctor, requestDto.getAppointmentDateTime())
                .stream()
                .anyMatch(a -> a.getStatus() == AppointmentStatus.SCHEDULED);
        if (isSlotBooked) {
            throw new GlobalExceptionHandler.AppointmentException("Выбранное время уже занято. Пожалуйста, выберите другой слот.");
        }

        boolean patientHasExistingAppointmentAtTime = appointmentRepository.findByPatientAndAppointmentDateTime(patient, requestDto.getAppointmentDateTime())
                .stream()
                .anyMatch(a -> a.getStatus() == AppointmentStatus.SCHEDULED);
        if (patientHasExistingAppointmentAtTime) {
            throw new GlobalExceptionHandler.AppointmentException("У вас уже есть запись на это время. Пожалуйста, выберите другое время.");
        }


        Appointment newAppointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDateTime(requestDto.getAppointmentDateTime())
                .status(AppointmentStatus.SCHEDULED)
                .build();

        Appointment savedAppointment = appointmentRepository.save(newAppointment);

        return new AppointmentResponseDto(
                savedAppointment.getAppointmentId(),
                savedAppointment.getPatient().getPatientId(),
                savedAppointment.getPatient().getFirstName(),
                savedAppointment.getPatient().getLastName(),
                savedAppointment.getDoctor().getDoctorId(),
                savedAppointment.getDoctor().getFirstName(),
                savedAppointment.getDoctor().getLastName(),
                savedAppointment.getDoctor().getSpecialization(),
                savedAppointment.getAppointmentDateTime(),
                savedAppointment.getStatus()
        );
    }

    @Override
    @Transactional
    public void cancelAppointment(UUID appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new GlobalExceptionHandler.ResourceNotFoundException("Appointment not found with ID: " + appointmentId));

        if (appointment.getStatus() == AppointmentStatus.CANCELED || appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new GlobalExceptionHandler.AppointmentException("Невозможно отменить запись со статусом " + appointment.getStatus().name());
        }

        appointment.setStatus(AppointmentStatus.CANCELED);
        appointmentRepository.save(appointment);
    }


}
