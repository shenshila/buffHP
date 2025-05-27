package org.melekhov.buffhp.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorAppointmentCountDto {
    private String doctorName;
    private Long appointmentCount;
}
