package org.melekhov.buffhp.services.impl;

import org.melekhov.buffhp.dtos.UpdateUserRoleRequestDto;
import org.melekhov.buffhp.dtos.UserResponseDto;
import org.melekhov.buffhp.entities.Role;
import org.melekhov.buffhp.entities.User;
import org.melekhov.buffhp.repositories.RoleRepository;
import org.melekhov.buffhp.repositories.UserRepository;
import org.melekhov.buffhp.services.AdminUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AdminUserServiceImpl implements AdminUserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;

    @Override
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserResponseDto(
                        user.getUserId(),
                        user.getEmail(),
                        user.getFullName(),
                        user.getRoles().stream().map(Role::getName).collect(Collectors.toSet())
                ))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserResponseDto updateUserRoles(UpdateUserRoleRequestDto request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new NoSuchElementException("Пользователь с ID " + request.getUserId() + " не найден."));

        Set<Role> newRoles = request.getNewRoles().stream()
                .map(roleName -> roleRepository.findByName(roleName)
                        .orElseThrow(() -> new NoSuchElementException("Роль '" + roleName + "' не найдена.")))
                .collect(Collectors.toSet());

        // Важное замечание: убедитесь, что вы не удаляете "ROLE_PATIENT" у пациента
        // или "ROLE_DOCTOR" у доктора, если они связаны.
        // Здесь мы просто заменяем все роли. Если нужна более сложная логика, добавьте ее.
        user.setRoles(newRoles);
        userRepository.save(user);

        return new UserResponseDto(
                user.getUserId(),
                user.getEmail(),
                user.getFullName(),
                user.getRoles().stream().map(Role::getName).collect(Collectors.toSet())
        );
    }

    @Override
    public Set<String> getAllRoleNames() {
        return roleRepository.findAll().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
    }
}
