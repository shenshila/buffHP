package org.melekhov.buffhp.services;

import org.springframework.stereotype.Service;

@Service
public interface AIChatService {
    String analyzeSymptoms(String symptoms);
}
