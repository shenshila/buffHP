package org.melekhov.buffhp.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRoleRequestDto {
    private UUID userId;
    private Set<String> newRoles;
}
