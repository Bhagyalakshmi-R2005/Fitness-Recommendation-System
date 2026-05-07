package com.fitness.fitness_common.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Activity {

    private String id;
    private String type;
    private int duration;
    private int caloriesBurned;
    private String additionalMetrics;
    private String userId;
}