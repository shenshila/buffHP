package org.melekhov.buffhp.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DoctorAvailableSlotsDto {
    private UUID doctorId;
    private String firstName;
    private String lastName;
    private String specialization;
    private LocalDate date;
    private List<LocalTime> availableTimes;
}
