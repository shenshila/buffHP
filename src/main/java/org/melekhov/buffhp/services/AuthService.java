package org.melekhov.buffhp.services;

import org.melekhov.buffhp.dtos.RegistrationRequestDto;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {

    void register(RegistrationRequestDto registrationRequestDto);
    String login(String email, String password);

}
