package org.melekhov.buffhp.mappers;

import org.melekhov.buffhp.dtos.DoctorDto;
import org.melekhov.buffhp.entities.Doctor;
import org.springframework.stereotype.Component;

@Component
public class DoctorMapper {
    public DoctorDto toDoctorDto(Doctor doctor) {
        DoctorDto doctorDto = DoctorDto.builder()
                .id(doctor.getDoctorId())
                .firstName(doctor.getFirstName())
                .lastName(doctor.getLastName())
                .phone(doctor.getPhone())
                .email(doctor.getEmail())
                .specialization(doctor.getSpecialization())
                .build();

        return doctorDto;
    }
}
