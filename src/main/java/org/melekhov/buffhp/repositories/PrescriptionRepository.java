package org.melekhov.buffhp.repositories;

import org.melekhov.buffhp.entities.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, UUID> {

    @Query("SELECT mr FROM Prescription mr WHERE mr.patient.patientId = :patientId")
    List<Prescription> findByPatientId(@Param("patientId") UUID patientId);

    @Query("SELECT mr FROM Prescription mr WHERE mr.doctor.doctorId = :doctorId")
    List<Prescription> findByDoctorId(@Param("doctorId") UUID doctorId);

    Optional<Prescription> findByVerificationCode(String code);

//    List<Prescription> findByDoctorId(UUID doctorId);

}
