package com.fitai.backend.service.impl;

import com.fitai.backend.dto.analytics.AnalyticsSummaryDto;
import com.fitai.backend.service.AnalyticsService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    @Override
    public AnalyticsSummaryDto getAnalyticsSummary(String range) {
        Map<String, Integer> strengthRadar = Map.of(
                "Press", 85,
                "Squat", 78,
                "Deads", 90,
                "Pull", 82,
                "Bench", 88
        );

        List<Map<String, Object>> caloriesBurnedWeekly = List.of(
                Map.of("day", "M", "kcal", 380),
                Map.of("day", "T", "kcal", 420),
                Map.of("day", "W", "kcal", 450),
                Map.of("day", "T", "kcal", 390),
                Map.of("day", "F", "kcal", 510),
                Map.of("day", "S", "kcal", 460),
                Map.of("day", "S", "kcal", 300)
        );

        List<String> achievements = List.of(
                "100 Workouts Completed",
                "5KG Weight Lost",
                "30 Day Workout Streak",
                "New PR: Bench 90kg",
                "Consistency King"
        );

        return AnalyticsSummaryDto.builder()
                .fitnessScore(85)
                .completionPercentage(76)
                .strengthRadar(strengthRadar)
                .caloriesBurnedWeekly(caloriesBurnedWeekly)
                .achievements(achievements)
                .aiInsights("Your workout consistency improved by 18% over the past 30 days. Lower back strain recovery is entering phase 3 (resolved). Increase lower body intensity next week to keep strength gains balanced.")
                .build();
    }
}
