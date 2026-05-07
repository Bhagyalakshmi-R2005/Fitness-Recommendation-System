package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.repository.RecommendationRepository;
import com.fitness.fitness_common.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDateTime;
@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAIService {
    private final RecommendationRepository recommendationRepository;
    private final GeminiService geminiService;
    public String generateRecommendation(Activity activity){
        String prompt = createPromptForActivty(activity);
        String aiResponse = geminiService.getAnswer(prompt);
        log.info("Response from AI: {}", aiResponse);
        processAiResponse(activity,aiResponse);
        Recommendation rec = convertToRecommendation(activity, aiResponse);
        if (rec != null) {
            recommendationRepository.save(rec);
            log.info("Recommendation saved successfully");
        } else {
            log.error("Failed to convert recommendation");
        }
        return aiResponse;
    }
    private void processAiResponse(Activity activity, String aiResponse) {
        try {
            ObjectMapper mapper = new ObjectMapper();

            // 🔥 Directly parse AI response (already clean JSON)
            JsonNode finalJson = mapper.readTree(aiResponse);

            String overall = finalJson.path("analysis").path("overall").asText();
            String pace = finalJson.path("analysis").path("pace").asText();

            log.info("Overall: {}", overall);
            log.info("Pace: {}", pace);

            // Improvements
            JsonNode improvements = finalJson.path("improvements");
            for (JsonNode imp : improvements) {
                log.info("Area: {}", imp.path("area").asText());
                log.info("Recommendation: {}", imp.path("recommendation").asText());
            }

            // Suggestions
            JsonNode suggestions = finalJson.path("suggestions");
            for (JsonNode sug : suggestions) {
                log.info("Workout: {}", sug.path("workout").asText());
                log.info("Description: {}", sug.path("description").asText());
            }

        } catch (Exception e) {
            log.error("Error parsing AI response", e);
        }
    }
    private Recommendation convertToRecommendation(Activity activity, String aiResponse) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(aiResponse);

            // -------- Convert improvements --------
            // -------- Convert improvements --------
            List<String> improvements = new ArrayList<>();
            for (JsonNode node : root.path("improvements")) {
                String text = node.path("area").asText() + " - " +
                        node.path("recommendation").asText();
                improvements.add(text);
            }

// 🔥 Fallback if less than 3
            while (improvements.size() < 3) {
                improvements.add("General Improvement - Try to improve consistency and performance");
            }


// -------- Convert suggestions --------
            List<String> suggestions = new ArrayList<>();
            for (JsonNode node : root.path("suggestions")) {
                String text = node.path("workout").asText() + " - " +
                        node.path("description").asText();
                suggestions.add(text);
            }

// 🔥 Fallback if less than 3
            while (suggestions.size() < 3) {
                suggestions.add("General Suggestion - Include strength and endurance training");
            }


// -------- Convert safety --------
            List<String> safetyList = new ArrayList<>();
            for (JsonNode node : root.path("safety")) {
                String advice = node.path("advice").asText();
                if (advice != null && !advice.isEmpty()) {
                    safetyList.add(advice);
                }
            }

// 🔥 Fallback if empty
            if (safetyList.isEmpty()) {
                safetyList.add("Stay hydrated during workouts");
                safetyList.add("Warm up before exercise");
                safetyList.add("Avoid overtraining");
            }
            // -------- Final Recommendation Text --------
            String overall = root.path("analysis").path("overall").asText();
            String pace = root.path("analysis").path("pace").asText();
            String heartRate = root.path("analysis").path("heartRate").asText();
            String calories = root.path("analysis").path("caloriesBurned").asText();

            String recommendationText = String.format(
                    "Overall Performance: %s. Pace: %s. Heart Rate: %s. Calories Burned: %s.",
                    overall, pace, heartRate, calories
            );

            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserId())   // if exists
                    .activityType(activity.getType())
                    .recommendation(recommendationText)
                    .improvements(improvements)
                    .suggestions(suggestions)
                    .safety(safetyList)
                    .createdAt(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    private String createPromptForActivty(Activity activity) {
        return String.format("""
You are a fitness AI assistant.

STRICT RULES:
- Return ONLY valid JSON (no explanation, no markdown)
- ALWAYS return EXACTLY:
  - 3 improvements
  - 3 suggestions
  - 3 safety items
- Do NOT leave any field empty
- Do NOT skip safety
- Fill all values meaningfully

JSON format:
{
  "analysis": {
    "overall": "",
    "pace": "",
    "heartRate": "",
    "caloriesBurned": ""
  },
  "improvements": [
    {"area": "", "recommendation": ""},
    {"area": "", "recommendation": ""},
    {"area": "", "recommendation": ""}
  ],
  "suggestions": [
    {"workout": "", "description": ""},
    {"workout": "", "description": ""},
    {"workout": "", "description": ""}
  ],
  "safety": [
    {"advice": ""},
    {"advice": ""},
    {"advice": ""}
  ]
}

Activity Data:
- Type: %s
- Duration: %d minutes
- Calories Burned: %d
- Additional Metrics: %s
""",
                activity.getType(),
                activity.getDuration(),
                activity.getCaloriesBurned(),
                activity.getAdditionalMetrics()
        );

    }

}
