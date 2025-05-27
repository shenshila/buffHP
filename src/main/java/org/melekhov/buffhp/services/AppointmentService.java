package org.melekhov.buffhp.services;

import org.melekhov.buffhp.dtos.*;
import org.melekhov.buffhp.entities.Doctor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public interface AppointmentService {
    DoctorAvailableSlotsDto getAvailableSlots(UUID doctorId, LocalDate date);
    AppointmentResponseDto createAppointment(UUID patientId, AppointmentRequestDto requestDto);
    void cancelAppointment(UUID appointmentId);
    List<DoctorDto> getAllDoctors();
}
