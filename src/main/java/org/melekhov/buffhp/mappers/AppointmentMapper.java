package org.melekhov.buffhp.mappers;

import lombok.RequiredArgsConstructor;
import org.melekhov.buffhp.dtos.AppointmentDto;
import org.melekhov.buffhp.entities.Appointment;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AppointmentMapper {
    private final PatientMapper patientMapper;
    private final DoctorMapper doctorMapper;

    public AppointmentDto toDto(Appointment appointment) {

        return AppointmentDto.builder()
                .appointmentId(appointment.getAppointmentId())
                .patient(patientMapper.toDto(appointment.getPatient()))
                .doctor(doctorMapper.toDoctorDto(appointment.getDoctor()))
                .appointmentDate(appointment.getAppointmentDateTime())
                .appointmentStatus(appointment.getStatus())
                .build();
    }
}
