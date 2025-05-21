package org.melekhov.buffhp.controllers;

import lombok.RequiredArgsConstructor;
import org.melekhov.buffhp.entities.User;
import org.melekhov.buffhp.repositories.UserRepository;
import org.melekhov.buffhp.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

@Controller
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;
    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<Object> getCurrentUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getCurrentUserId(userDetails);
        Object user = userService.getUserProfile(userId);

        return ResponseEntity.ok().body(user);
    }

    public UUID getCurrentUserId(UserDetails userDetails) {
        String username = userDetails.getUsername();
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));

        return user.getUserId();
    }
}
