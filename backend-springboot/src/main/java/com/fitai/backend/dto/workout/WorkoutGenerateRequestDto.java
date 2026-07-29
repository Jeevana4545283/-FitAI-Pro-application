package com.fitai.backend.dto.workout;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

@Schema(description = "AI Workout Generation Request Data Transfer Object")
public class WorkoutGenerateRequestDto {

    @NotBlank(message = "Goal is required")
    @Schema(description = "Primary target goal", example = "Muscle Gain")
    private String goal;

    @Min(value = 10, message = "Time must be at least 10 minutes")
    @Max(value = 180, message = "Time cannot exceed 180 minutes")
    @Schema(description = "Target duration in minutes", example = "45")
    private Integer time;

    @Schema(description = "Available equipment list", example = "[\"Dumbbells\", \"Barbell\"]")
    private List<String> equip;

    @Schema(description = "Difficulty level", example = "Intermediate")
    private String difficulty;

    public WorkoutGenerateRequestDto() {
    }

    public WorkoutGenerateRequestDto(String goal, Integer time, List<String> equip, String difficulty) {
        this.goal = goal;
        this.time = time;
        this.equip = equip;
        this.difficulty = difficulty;
    }

    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }

    public Integer getTime() { return time; }
    public void setTime(Integer time) { this.time = time; }

    public List<String> getEquip() { return equip; }
    public void setEquip(List<String> equip) { this.equip = equip; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
}
