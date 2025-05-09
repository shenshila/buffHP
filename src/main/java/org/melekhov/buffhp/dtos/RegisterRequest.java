package org.melekhov.buffhp.dtos;

import lombok.Builder;
import lombok.Data;
import org.melekhov.buffhp.entities.enums.UserRole;

import java.time.LocalDate;

@Data
@Builder
public class RegisterRequest {
    private String username;
    private String password;
    private String email;
    private UserRole role; // "DOCTOR" или "PATIENT"

    // Данные доктора (если role = DOCTOR)
    private String firstName;
    private String lastName;
    private String specialization;
    private String phone;

    // Данные пациента (если role = PATIENT)
    private String middleName;
    private LocalDate birthDate;
    private String gender;
    private String address;
    private String insuranceNumber;
}
