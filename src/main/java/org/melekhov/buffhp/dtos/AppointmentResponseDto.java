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
public class AppointmentResponseDto {
    private UUID appointmentId;
    private UUID patientId;
    private String patientFirstName;
    private String patientLastName;
    private UUID doctorId;
    private String doctorFirstName;
    private String doctorLastName;
    private String doctorSpecialization;
    private LocalDateTime appointmentDateTime;
    private AppointmentStatus status;
}
