package org.melekhov.buffhp.dtos;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class DoctorDto {

    private UUID id;
    private String firstName;
    private String lastName;
    private String specialization;
    private String phone;
    private String email;

}
