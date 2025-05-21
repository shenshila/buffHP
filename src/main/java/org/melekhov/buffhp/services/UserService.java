package org.melekhov.buffhp.services;

import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public interface UserService {
    Object getUserProfile(UUID userId);
}
