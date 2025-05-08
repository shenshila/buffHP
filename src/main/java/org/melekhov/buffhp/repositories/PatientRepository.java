package org.melekhov.buffhp.repositories;

import org.melekhov.buffhp.entities.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PatientRepository extends JpaRepository<Patient, UUID> {

    @Query("SELECT p FROM Patient p " +
            "WHERE LOWER(p.firstName) LIKE LOWER(concat('%', :keyword, '%')) OR " +
            "LOWER(p.lastName) LIKE LOWER(concat('%', :keyword, '%'))")
    List<Patient> searchByKeyword(@Param("keyword") String keyword);

//    List<Patient> findByFirstNameAndLastName(String firstName, String lastName);

    Optional<Patient> findByInsuranceNumber(String insuranceNumber);

    List<Patient> findByBirthDateBetween(LocalDate startDate, LocalDate endDate);

    List<Patient> findByGender(String gender);

    List<Patient> findByGenderAndBirthDateBetween(String gender, LocalDate startDate, LocalDate endDate);
}
