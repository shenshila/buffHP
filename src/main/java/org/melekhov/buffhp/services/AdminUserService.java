package org.melekhov.buffhp.services;

import org.melekhov.buffhp.dtos.UpdateUserRoleRequestDto;
import org.melekhov.buffhp.dtos.UserResponseDto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public interface AdminUserService {
    List<UserResponseDto> getAllUsers();
    UserResponseDto updateUserRoles(UpdateUserRoleRequestDto request);
    Set<String> getAllRoleNames();
}
