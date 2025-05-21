package org.melekhov.buffhp.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import org.melekhov.buffhp.entities.User;
import org.melekhov.buffhp.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.melekhov.buffhp.entities.Role;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private final UserRepository userRepository;

    public String generateToken(User user) {
        Claims claims = Jwts.claims().setSubject(user.getEmail());  // Используем email как subject
        claims.put("roles", user.getRoles().stream().map(Role::getName).collect(Collectors.toList()));
        claims.put("fullName", user.getFullName());

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secret).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getEmailFromToken(String token) {
        return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody().getSubject();
    }
}
