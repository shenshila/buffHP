package org.melekhov.buffhp.repositories;

import org.melekhov.buffhp.entities.MedicalRecord;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, UUID> {
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.patient.patientId = :patientId")
    List<MedicalRecord> findByPatientId(@Param("patientId") UUID patientId);

    @Override
    @EntityGraph(attributePaths = {"patient"}) // Для избежания N+1
    Optional<MedicalRecord> findById(UUID id);

}
