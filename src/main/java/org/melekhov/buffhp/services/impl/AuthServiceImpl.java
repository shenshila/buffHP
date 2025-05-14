package org.melekhov.buffhp.services.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.melekhov.buffhp.dtos.RegistrationRequestDto;
import org.melekhov.buffhp.entities.Doctor;
import org.melekhov.buffhp.entities.Patient;
import org.melekhov.buffhp.entities.Role;
import org.melekhov.buffhp.entities.User;
import org.melekhov.buffhp.entities.enums.UserRole;
import org.melekhov.buffhp.mappers.DoctorMapper;
import org.melekhov.buffhp.mappers.PatientMapper;
import org.melekhov.buffhp.mappers.UserMapper;
import org.melekhov.buffhp.repositories.DoctorRepository;
import org.melekhov.buffhp.repositories.PatientRepository;
import org.melekhov.buffhp.repositories.RoleRepository;
import org.melekhov.buffhp.repositories.UserRepository;
import org.melekhov.buffhp.services.AuthService;
import org.melekhov.buffhp.util.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final RoleRepository roleRepository;

    private final UserMapper userMapper;
    private final PatientMapper patientMapper;
    private final DoctorMapper doctorMapper;

    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public void register(RegistrationRequestDto registrationRequestDto) {
        if (userRepository.existsByEmail(registrationRequestDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Role role = roleRepository.findByName(registrationRequestDto.getRole().getName());
        if (role == null) {
            throw new RuntimeException("Role not found");
        }

        User user = userMapper.toEntity(registrationRequestDto);
        user.setRoles(Set.of(role));
        userRepository.save(user);

        if (registrationRequestDto.getRole() == UserRole.ROLE_PATIENT) {
            Patient patient = patientMapper.toEntity(registrationRequestDto, user);
            patientRepository.save(patient);
        } else if (registrationRequestDto.getRole() == UserRole.ROLE_DOCTOR) {
            Doctor doctor = doctorMapper.toEntity(registrationRequestDto, user);
            doctorRepository.save(doctor);
        }
    }

    @Override
    public String login(String email, String password) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
        } catch (AuthenticationException e) {
            throw new BadCredentialsException("Invalid email or password");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return jwtTokenProvider.generateToken(email, user.getRoles());
    }


}
