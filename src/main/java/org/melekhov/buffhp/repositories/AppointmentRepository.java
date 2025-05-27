package org.melekhov.buffhp.repositories;

import org.melekhov.buffhp.entities.Appointment;
import org.melekhov.buffhp.entities.Doctor;
import org.melekhov.buffhp.entities.MedicalRecord;
import org.melekhov.buffhp.entities.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    @Query("SELECT mr FROM Appointment mr WHERE mr.patient.patientId = :patientId")
    List<Appointment> findByPatientId(@Param("patientId") UUID patientId);

    @Query("SELECT mr FROM Appointment mr WHERE mr.doctor.doctorId = :doctorId")
    List<Appointment> findByDoctorId(@Param("doctorId") UUID doctorId);

    // Найти все записи доктора в определенном диапазоне дат/времени
    List<Appointment> findByDoctorAndAppointmentDateTimeBetween(Doctor doctor, LocalDateTime start, LocalDateTime end);

    // Найти запись доктора на конкретное время
    Optional<Appointment> findByDoctorAndAppointmentDateTime(Doctor doctor, LocalDateTime dateTime);

    // Найти запись пациента на конкретное время
    Optional<Appointment> findByPatientAndAppointmentDateTime(Patient patient, LocalDateTime dateTime);

    // Получить все записи пациента (для личного кабинета)
    List<Appointment> findByPatient_PatientIdOrderByAppointmentDateTimeDesc(UUID patientId);

    // Получить все записи доктора (для личного кабинета)
    List<Appointment> findByDoctor_DoctorIdOrderByAppointmentDateTimeDesc(UUID doctorId);

}
