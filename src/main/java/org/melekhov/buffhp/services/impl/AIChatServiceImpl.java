package org.melekhov.buffhp.services.impl;

import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.output.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.melekhov.buffhp.services.AIChatService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIChatServiceImpl implements AIChatService {
    private final OpenAiChatModel chatModel;

    @Override
    public String analyzeSymptoms(String symptoms) {
        ChatMessage systemMessage = SystemMessage.from("""
            Ты — медицинский ассистент. Проанализируй симптомы пациента. Верни результат в следующем формате:
                    
            Диагноз: <возможный диагноз>
            Лечение: <основные рекомендации>
                    
            Не используй сложные термины. Максимум 3-4 строки.
        """);

        ChatMessage userMessage = UserMessage.from(symptoms);

        List<ChatMessage> messages = List.of(systemMessage, userMessage);

        Response<AiMessage> response = chatModel.generate(messages);

        return response.content().text();
    }
}
