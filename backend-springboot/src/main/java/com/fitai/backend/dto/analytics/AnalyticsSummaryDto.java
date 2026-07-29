package com.fitai.backend.dto.analytics;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import java.util.Map;

@Schema(description = "User Analytics & Progress Summary Data Transfer Object")
public class AnalyticsSummaryDto {

    @Schema(description = "Overall fitness score out of 100", example = "85")
    private Integer fitnessScore;

    @Schema(description = "Workout compliance percentage", example = "76")
    private Integer completionPercentage;

    @Schema(description = "Strength progress radar metrics (Press, Squat, Deads, Pull, Bench)")
    private Map<String, Integer> strengthRadar;

    @Schema(description = "Weekly calories burned data points")
    private List<Map<String, Object>> caloriesBurnedWeekly;

    @Schema(description = "Achievements list")
    private List<String> achievements;

    @Schema(description = "AI insights summary text", example = "Your workout consistency improved by 18% over the past 30 days...")
    private String aiInsights;

    public AnalyticsSummaryDto() {
    }

    public AnalyticsSummaryDto(Integer fitnessScore, Integer completionPercentage, Map<String, Integer> strengthRadar, List<Map<String, Object>> caloriesBurnedWeekly, List<String> achievements, String aiInsights) {
        this.fitnessScore = fitnessScore;
        this.completionPercentage = completionPercentage;
        this.strengthRadar = strengthRadar;
        this.caloriesBurnedWeekly = caloriesBurnedWeekly;
        this.achievements = achievements;
        this.aiInsights = aiInsights;
    }

    public static AnalyticsSummaryDtoBuilder builder() {
        return new AnalyticsSummaryDtoBuilder();
    }

    public Integer getFitnessScore() { return fitnessScore; }
    public void setFitnessScore(Integer fitnessScore) { this.fitnessScore = fitnessScore; }

    public Integer getCompletionPercentage() { return completionPercentage; }
    public void setCompletionPercentage(Integer completionPercentage) { this.completionPercentage = completionPercentage; }

    public Map<String, Integer> getStrengthRadar() { return strengthRadar; }
    public void setStrengthRadar(Map<String, Integer> strengthRadar) { this.strengthRadar = strengthRadar; }

    public List<Map<String, Object>> getCaloriesBurnedWeekly() { return caloriesBurnedWeekly; }
    public void setCaloriesBurnedWeekly(List<Map<String, Object>> caloriesBurnedWeekly) { this.caloriesBurnedWeekly = caloriesBurnedWeekly; }

    public List<String> getAchievements() { return achievements; }
    public void setAchievements(List<String> achievements) { this.achievements = achievements; }

    public String getAiInsights() { return aiInsights; }
    public void setAiInsights(String aiInsights) { this.aiInsights = aiInsights; }

    public static class AnalyticsSummaryDtoBuilder {
        private Integer fitnessScore;
        private Integer completionPercentage;
        private Map<String, Integer> strengthRadar;
        private List<Map<String, Object>> caloriesBurnedWeekly;
        private List<String> achievements;
        private String aiInsights;

        public AnalyticsSummaryDtoBuilder fitnessScore(Integer fitnessScore) { this.fitnessScore = fitnessScore; return this; }
        public AnalyticsSummaryDtoBuilder completionPercentage(Integer completionPercentage) { this.completionPercentage = completionPercentage; return this; }
        public AnalyticsSummaryDtoBuilder strengthRadar(Map<String, Integer> strengthRadar) { this.strengthRadar = strengthRadar; return this; }
        public AnalyticsSummaryDtoBuilder caloriesBurnedWeekly(List<Map<String, Object>> caloriesBurnedWeekly) { this.caloriesBurnedWeekly = caloriesBurnedWeekly; return this; }
        public AnalyticsSummaryDtoBuilder achievements(List<String> achievements) { this.achievements = achievements; return this; }
        public AnalyticsSummaryDtoBuilder aiInsights(String aiInsights) { this.aiInsights = aiInsights; return this; }

        public AnalyticsSummaryDto build() {
            return new AnalyticsSummaryDto(fitnessScore, completionPercentage, strengthRadar, caloriesBurnedWeekly, achievements, aiInsights);
        }
    }
}
