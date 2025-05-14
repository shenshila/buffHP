package org.melekhov.buffhp.mappers;

import org.melekhov.buffhp.dtos.DoctorDto;
import org.melekhov.buffhp.dtos.RegistrationRequestDto;
import org.melekhov.buffhp.entities.Doctor;
import org.melekhov.buffhp.entities.User;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class DoctorMapper {
    public DoctorDto toDoctorDto(Doctor doctor) {

        return DoctorDto.builder()
                .id(doctor.getDoctorId())
                .firstName(doctor.getFirstName())
                .lastName(doctor.getLastName())
                .phone(doctor.getPhone())
                .email(doctor.getEmail())
                .specialization(doctor.getSpecialization())
                .build();
    }

    public Doctor toEntity(RegistrationRequestDto request, User user) {

        return Doctor.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .specialization(request.getSpecialization())
                .phone(request.getPhone())
                .user(user)
                .build();
    }
}
