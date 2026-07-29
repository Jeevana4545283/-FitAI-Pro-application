package com.fitai.backend.dto.workout;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Finished Workout Session Summary Response Data Transfer Object")
public class WorkoutSessionFinishResponseDto {

    @Schema(description = "Completed workout ID", example = "wkt-1")
    private String workoutId;

    @Schema(description = "Total workout duration in seconds", example = "2700")
    private Integer duration;

    @Schema(description = "Total calories burned in kcal", example = "420")
    private Integer calories;

    @Schema(description = "Session completion percentage", example = "100.0")
    private Double completedPct;

    @Schema(description = "XP points earned for completing workout", example = "150")
    private Integer xpEarned;

    @Schema(description = "Coins earned for completing workout", example = "42")
    private Integer coinsEarned;

    @Schema(description = "Updated workout streak count", example = "25")
    private Integer updatedStreak;

    @Schema(description = "Motivational summary message", example = "Workout complete! You earned +150 XP and +42 coins.")
    private String message;

    public WorkoutSessionFinishResponseDto() {
    }

    public WorkoutSessionFinishResponseDto(String workoutId, Integer duration, Integer calories, Double completedPct, Integer xpEarned, Integer coinsEarned, Integer updatedStreak, String message) {
        this.workoutId = workoutId;
        this.duration = duration;
        this.calories = calories;
        this.completedPct = completedPct;
        this.xpEarned = xpEarned;
        this.coinsEarned = coinsEarned;
        this.updatedStreak = updatedStreak;
        this.message = message;
    }

    public static WorkoutSessionFinishResponseDtoBuilder builder() {
        return new WorkoutSessionFinishResponseDtoBuilder();
    }

    public String getWorkoutId() { return workoutId; }
    public void setWorkoutId(String workoutId) { this.workoutId = workoutId; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public Integer getCalories() { return calories; }
    public void setCalories(Integer calories) { this.calories = calories; }

    public Double getCompletedPct() { return completedPct; }
    public void setCompletedPct(Double completedPct) { this.completedPct = completedPct; }

    public Integer getXpEarned() { return xpEarned; }
    public void setXpEarned(Integer xpEarned) { this.xpEarned = xpEarned; }

    public Integer getCoinsEarned() { return coinsEarned; }
    public void setCoinsEarned(Integer coinsEarned) { this.coinsEarned = coinsEarned; }

    public Integer getUpdatedStreak() { return updatedStreak; }
    public void setUpdatedStreak(Integer updatedStreak) { this.updatedStreak = updatedStreak; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public static class WorkoutSessionFinishResponseDtoBuilder {
        private String workoutId;
        private Integer duration;
        private Integer calories;
        private Double completedPct;
        private Integer xpEarned;
        private Integer coinsEarned;
        private Integer updatedStreak;
        private String message;

        public WorkoutSessionFinishResponseDtoBuilder workoutId(String workoutId) { this.workoutId = workoutId; return this; }
        public WorkoutSessionFinishResponseDtoBuilder duration(Integer duration) { this.duration = duration; return this; }
        public WorkoutSessionFinishResponseDtoBuilder calories(Integer calories) { this.calories = calories; return this; }
        public WorkoutSessionFinishResponseDtoBuilder completedPct(Double completedPct) { this.completedPct = completedPct; return this; }
        public WorkoutSessionFinishResponseDtoBuilder xpEarned(Integer xpEarned) { this.xpEarned = xpEarned; return this; }
        public WorkoutSessionFinishResponseDtoBuilder coinsEarned(Integer coinsEarned) { this.coinsEarned = coinsEarned; return this; }
        public WorkoutSessionFinishResponseDtoBuilder updatedStreak(Integer updatedStreak) { this.updatedStreak = updatedStreak; return this; }
        public WorkoutSessionFinishResponseDtoBuilder message(String message) { this.message = message; return this; }

        public WorkoutSessionFinishResponseDto build() {
            return new WorkoutSessionFinishResponseDto(workoutId, duration, calories, completedPct, xpEarned, coinsEarned, updatedStreak, message);
        }
    }
}
