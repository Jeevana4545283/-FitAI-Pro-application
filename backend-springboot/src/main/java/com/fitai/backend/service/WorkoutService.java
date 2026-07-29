package com.fitai.backend.service;

import com.fitai.backend.dto.workout.*;

import java.util.List;

public interface WorkoutService {

    List<WorkoutPlanDto> getAllWorkouts(String category, String query);

    WorkoutPlanDto getWorkoutById(String id);

    WorkoutPlanDto generateAIWorkout(WorkoutGenerateRequestDto requestDto);

    WorkoutSessionFinishResponseDto finishWorkoutSession(String workoutId, Integer duration, Integer calories, Double completedPct);
}
