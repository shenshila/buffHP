package org.melekhov.buffhp.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.melekhov.buffhp.entities.enums.MedicalRecordSource;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "medical_record")
public class MedicalRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "medical_record_id")
    private UUID medicalRecordId;

    @Version
    private Long version;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    private LocalDate recordDate;
    private String diagnosis;
    private String treatment;
    private String symptoms;
    private MedicalRecordSource source;

    @ManyToOne
    @JoinColumn(name = "confirmed_by_doctor_id")
    private Doctor confirmedByDoctor;

    private LocalDateTime confirmedDate;

//    @Lob
//    private String attachments; // Можно хранить ссылки на файлы (анализы, снимки)
}
