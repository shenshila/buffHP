package org.melekhov.buffhp.controllers;

import org.melekhov.buffhp.dtos.UpdateUserRoleRequestDto;
import org.melekhov.buffhp.dtos.UserResponseDto;
import org.melekhov.buffhp.services.AdminUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')") // Только пользователи с ролью ADMIN могут получить доступ к этому контроллеру
public class AdminController {

    @Autowired
    private AdminUserService adminUserService;

    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        List<UserResponseDto> users = adminUserService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/roles")
    public ResponseEntity<UserResponseDto> updateUserRoles(@RequestBody UpdateUserRoleRequestDto request) {
        UserResponseDto updatedUser = adminUserService.updateUserRoles(request);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/roles")
    public ResponseEntity<Set<String>> getAllRoles() {
        Set<String> roles = adminUserService.getAllRoleNames();
        return ResponseEntity.ok(roles);
    }
}