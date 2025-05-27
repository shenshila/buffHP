package org.melekhov.buffhp.dtos;

import lombok.Builder;
import lombok.Data;
import org.melekhov.buffhp.entities.enums.AppointmentStatus;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class AppointmentDto {
    private UUID appointmentId;
    private PatientDto patient;
    private DoctorDto doctor;
    private LocalDateTime appointmentDate;
    private AppointmentStatus appointmentStatus;
    private Boolean isBooked;
    private String reason;
}
