package org.melekhov.buffhp.mappers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.melekhov.buffhp.dtos.RegistrationRequestDto;
import org.melekhov.buffhp.entities.Role;
import org.melekhov.buffhp.entities.User;
import org.melekhov.buffhp.repositories.RoleRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserMapper {
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    public User toEntity(RegistrationRequestDto request) {
//        Role role = roleRepository.findByName(request.getRole())
//                .orElseThrow(() -> new RuntimeException("Role not found"));
//        user.setRoles(Set.of(role));
        User user = User.builder()
//                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .build();
        log.info("User: {}", user);
        return user;
    }
}
