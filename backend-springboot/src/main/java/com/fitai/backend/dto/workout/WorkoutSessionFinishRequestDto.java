package com.fitai.backend.dto.workout;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Payload submitted when a live workout session is completed")
public class WorkoutSessionFinishRequestDto {
    @Schema(description = "Workout Plan ID", example = "wkt-1")
    private String workoutId;

    @Schema(description = "Duration in minutes or seconds", example = "45")
    private Integer durationMinutes;

    @Schema(description = "Total estimated calories burned", example = "420")
    private Integer caloriesBurned;

    @Schema(description = "Number of exercises completed", example = "4")
    private Integer exercisesCompleted;

    public WorkoutSessionFinishRequestDto() {}

    public WorkoutSessionFinishRequestDto(String workoutId, Integer durationMinutes, Integer caloriesBurned, Integer exercisesCompleted) {
        this.workoutId = workoutId;
        this.durationMinutes = durationMinutes;
        this.caloriesBurned = caloriesBurned;
        this.exercisesCompleted = exercisesCompleted;
    }

    public String getWorkoutId() {
        return workoutId;
    }

    public void setWorkoutId(String workoutId) {
        this.workoutId = workoutId;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public Integer getCaloriesBurned() {
        return caloriesBurned;
    }

    public void setCaloriesBurned(Integer caloriesBurned) {
        this.caloriesBurned = caloriesBurned;
    }

    public Integer getExercisesCompleted() {
        return exercisesCompleted;
    }

    public void setExercisesCompleted(Integer exercisesCompleted) {
        this.exercisesCompleted = exercisesCompleted;
    }
}
