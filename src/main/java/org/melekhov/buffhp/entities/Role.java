package org.melekhov.buffhp.entities;

import jakarta.persistence.*;
import lombok.Data;
import org.melekhov.buffhp.entities.enums.UserRole;

import java.util.UUID;

@Data
@Entity
@Table(name = "role")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "role_id")
    private UUID roleId;

    @Column(nullable = false)
    private UserRole name; // "ROLE_ADMIN", "ROLE_DOCTOR", "ROLE_PATIENT"
}
