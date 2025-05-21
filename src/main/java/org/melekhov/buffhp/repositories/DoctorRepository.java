package org.melekhov.buffhp.repositories;

import org.melekhov.buffhp.entities.Doctor;
import org.melekhov.buffhp.entities.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, UUID> {
    @Query("SELECT p FROM Doctor p WHERE p.user.userId = :userId")
    Optional<Doctor> findByUserId(@Param("userId") UUID userId);

    Optional<Doctor> findByUserEmail(String email);
}
