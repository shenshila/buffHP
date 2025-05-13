package org.melekhov.buffhp.repositories;

import org.melekhov.buffhp.entities.Appointment;
import org.melekhov.buffhp.entities.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    @Query("SELECT mr FROM Appointment mr WHERE mr.patient.patientId = :patientId")
    List<Appointment> findByPatientId(@Param("patientId") UUID patientId);

}
