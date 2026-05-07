package com.fitness.activityservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientException;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserValidationService {

    private final WebClient userServiceWebClient;

    public boolean validateUser(String userId) {
        log.info("Calling User Validation API for userTd: {}",userId);
        try {
            Boolean result = userServiceWebClient.get()
                    .uri("/api/users/{userId}/validate", userId)
                    .retrieve()
                    .bodyToMono(Boolean.class)
                    .block();

            return Boolean.TRUE.equals(result);

        } catch (WebClientResponseException e) {

            int status = e.getStatusCode().value();

            if (status == 404) {
                throw new RuntimeException("User Not Found: " + userId);
            }

            if (status == 400) {
                throw new RuntimeException("Invalid Request: " + userId);
            }

            throw new RuntimeException("User service error: " + status);

        } catch (WebClientException e) {
            // 🔥 handles connection refused, timeout, server down
            throw new RuntimeException("User service is not reachable");
        }
    }
}