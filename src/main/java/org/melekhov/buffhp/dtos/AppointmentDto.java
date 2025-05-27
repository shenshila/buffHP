package org.melekhov.buffhp.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.melekhov.buffhp.entities.enums.AppointmentStatus;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentDto {
    private UUID appointmentId;
    private PatientDto patient;
    private DoctorDto doctor;
    private LocalDateTime appointmentDate;
    private AppointmentStatus appointmentStatus;
    private Boolean isBooked;
}
