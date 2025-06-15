package org.melekhov.buffhp.dtos;

import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Data
public class UserResponseDto {
    private UUID userId;
    private String email;
    private String fullName; // Для отображения ФИО пациента или доктора
    private Set<String> roles; // Названия ролей

    public UserResponseDto(UUID userId, String email, String fullName, Set<String> roles) {
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
        this.roles = roles;
    }
}