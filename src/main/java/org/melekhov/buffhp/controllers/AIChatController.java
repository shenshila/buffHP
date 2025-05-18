package org.melekhov.buffhp.controllers;

import lombok.RequiredArgsConstructor;
import org.melekhov.buffhp.services.AIChatService;
import org.melekhov.buffhp.services.PatientService;
import org.melekhov.buffhp.services.impl.AIChatServiceImpl;
import org.melekhov.buffhp.services.impl.PatientServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class AIChatController {

    private final AIChatServiceImpl aiChatService;
    private final PatientServiceImpl patientService;

    @PostMapping("/symptoms")
    public ResponseEntity<String> analyzeSymptoms(@RequestBody String symptoms) {
        UUID id = UUID.fromString("be5e4b64-078b-4eca-8ba1-ab6f6280e2b0");
        patientService.saveRecordFromAi(id, symptoms);
        return ResponseEntity.ok("Балдеж");
    }
}