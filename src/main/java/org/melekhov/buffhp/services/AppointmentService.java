package org.melekhov.buffhp.services;

import org.melekhov.buffhp.dtos.AppointmentDto;
import org.melekhov.buffhp.dtos.AppointmentRequestDto;
import org.melekhov.buffhp.dtos.DoctorAvailableSlotsDto;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;

@Service
public interface AppointmentService {
    DoctorAvailableSlotsDto getAvailableSlots(UUID doctorId, LocalDate date);
    AppointmentDto createAppointment(AppointmentRequestDto requestDto);
    void cancelAppointment(UUID appointmentId);
}
