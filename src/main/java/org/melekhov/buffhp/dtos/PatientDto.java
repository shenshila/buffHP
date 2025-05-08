package org.melekhov.buffhp.dtos;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class PatientDto {
    private UUID id;
    private String firstName;
    private String middleName;
    private String lastName;
    private String gender;
    private String phoneNumber;
    private LocalDate birthDate;
    private String insuranceNumber;
}
