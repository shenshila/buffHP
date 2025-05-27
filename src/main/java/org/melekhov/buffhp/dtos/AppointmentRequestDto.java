package org.melekhov.buffhp.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentRequestDto {
    @NotNull(message = "Patient ID is mandatory")
    private UUID patientId; // Это ID пациента, который делает запись. Может браться из контекста авторизации.
    @NotNull(message = "Doctor ID is mandatory")
    private UUID doctorId;
    @NotNull(message = "Appointment date and time is mandatory")
    private LocalDateTime appointmentDateTime;
    // Можно добавить причину визита
    private String reason;
}
