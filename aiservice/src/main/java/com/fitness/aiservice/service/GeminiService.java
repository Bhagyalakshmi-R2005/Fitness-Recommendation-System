package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class GeminiService {

    private final WebClient webClient;

    @Value("${groq.api.key}")
    private String groqApiKey;

    public GeminiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String getAnswer(String question) {

        // ✅ Groq request format (OpenAI style)
        Map<String, Object> requestBody = Map.of(
                "model", "llama-3.1-8b-instant",
                "messages", new Object[]{
                        Map.of(
                                "role", "user",
                                "content", question
                        )
                }
        );

        try {
            String response = webClient.post()
                    .uri("https://api.groq.com/openai/v1/chat/completions")
                    .header("Authorization", "Bearer " + groqApiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .onStatus(status -> status.isError(), clientResponse ->
                            clientResponse.bodyToMono(String.class)
                                    .flatMap(body ->
                                            reactor.core.publisher.Mono.error(
                                                    new RuntimeException("Groq API error: " + body)
                                            )
                                    )
                    )
                    .bodyToMono(String.class)
                    .block();

            // 🔍 Debug print (very important)
            System.out.println("RAW GROQ RESPONSE: " + response);

            if (response == null || response.isEmpty()) {
                return "AI service temporarily unavailable.";
            }

            // ✅ Parse response
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            JsonNode textNode = root.path("choices")
                    .get(0)
                    .path("message")
                    .path("content");

            if (textNode.isMissingNode()) {
                throw new RuntimeException("No text found in Groq response");
            }

            return textNode.asText();

        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return "Error processing AI response.";
        }
    }
}