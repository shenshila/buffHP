package org.melekhov.buffhp.dtos;

import lombok.Builder;
import lombok.Data;
import lombok.NonNull;
import org.melekhov.buffhp.entities.enums.UserRole;

import java.time.LocalDate;

@Data
@Builder
public class RegistrationRequestDto {

//    private String username;
    private String password;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    @NonNull
    private UserRole role; // ROLE_PATIENT или ROLE_DOCTOR

    // Поля пациента (если роль = PATIENT)
    private String middleName;
    private LocalDate birthDate;
    private String gender;
    private String address;
    private String insuranceNumber;

    // Поля доктора (если роль = DOCTOR)
    private String specialization;
}
