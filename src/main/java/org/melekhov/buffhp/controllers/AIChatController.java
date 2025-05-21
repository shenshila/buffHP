package org.melekhov.buffhp.controllers;

import lombok.RequiredArgsConstructor;
import org.melekhov.buffhp.entities.Patient;
import org.melekhov.buffhp.repositories.PatientRepository;
import org.melekhov.buffhp.services.AIChatService;
import org.melekhov.buffhp.services.PatientService;
import org.melekhov.buffhp.services.impl.AIChatServiceImpl;
import org.melekhov.buffhp.services.impl.PatientServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class AIChatController {

    private final AIChatServiceImpl aiChatService;
    private final PatientServiceImpl patientService;
    private final PatientRepository patientRepository;

    @PostMapping("/symptoms")
    public ResponseEntity<String> analyzeSymptoms(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> request) {

        // Получаем ID пациента из аутентификации
        UUID patientId = getCurrentPatientId(userDetails);
        String symptoms = request.get("text");

        // Сохраняем запрос и получаем ответ
        String aiResponse = aiChatService.analyzeSymptoms(symptoms);
        patientService.saveRecordFromAi(patientId, symptoms, aiResponse);

        return ResponseEntity.ok(aiResponse);
    }

    private UUID getCurrentPatientId(UserDetails userDetails) {
        String username = userDetails.getUsername();
        Patient patient = patientRepository.findByUserEmail(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException(username));

        return patient.getPatientId();
    }
}