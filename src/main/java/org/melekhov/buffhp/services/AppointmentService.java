package org.melekhov.buffhp.services;

import org.melekhov.buffhp.dtos.AppointmentDto;
import org.melekhov.buffhp.dtos.AppointmentRequestDto;
import org.melekhov.buffhp.dtos.AppointmentResponseDto;
import org.melekhov.buffhp.dtos.DoctorAvailableSlotsDto;
import org.melekhov.buffhp.entities.Doctor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public interface AppointmentService {
    DoctorAvailableSlotsDto getAvailableSlots(UUID doctorId, LocalDate date);
    AppointmentResponseDto createAppointment(AppointmentRequestDto requestDto);
    void cancelAppointment(UUID appointmentId);
    List<Doctor> getAllDoctors();
}
