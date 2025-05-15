package org.melekhov.buffhp.services;

import org.melekhov.buffhp.dtos.PrescriptionRequestDto;
import org.melekhov.buffhp.dtos.PrescriptionResponseDto;
import org.melekhov.buffhp.dtos.PrescriptionVerificationResult;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public interface PrescriptionService {
    PrescriptionResponseDto createPrescription(UUID doctorId, PrescriptionRequestDto request);
    PrescriptionVerificationResult verifyPrescription(String verificationCode);
}
