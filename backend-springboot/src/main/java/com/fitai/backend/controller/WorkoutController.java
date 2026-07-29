package com.fitai.backend.controller;

import com.fitai.backend.dto.workout.*;
import com.fitai.backend.service.WorkoutService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "Workouts & Live Sessions", description = "Endpoints for workout plans discovery, AI custom plan generation, and live session tracking")
public class WorkoutController {

    private final WorkoutService workoutService;

    @Autowired
    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

    @Operation(summary = "Get All Workout Plans", description = "Lists recommended workout plans. Filterable by category (Strength, Cardio, HIIT, Mobility) or search query.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Workouts list retrieved successfully",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = WorkoutPlanDto.class))))
    })
    @GetMapping("/workouts")
    public ResponseEntity<List<WorkoutPlanDto>> getAllWorkouts(
            @Parameter(description = "Category filter: 'Strength', 'Cardio', 'HIIT', 'Mobility'", example = "Strength")
            @RequestParam(name = "category", required = false) String category,
            @Parameter(description = "Search text query", example = "Push")
            @RequestParam(name = "query", required = false) String query) {
        List<WorkoutPlanDto> workouts = workoutService.getAllWorkouts(category, query);
        return ResponseEntity.ok(workouts);
    }

    @Operation(summary = "Get Workout Details by ID", description = "Retrieves complete exercise list, target muscle groups, and coach tips for a specific workout ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Workout plan details retrieved successfully",
                    content = @Content(schema = @Schema(implementation = WorkoutPlanDto.class))),
            @ApiResponse(responseCode = "404", description = "Workout plan not found")
    })
    @GetMapping("/workouts/{id}")
    public ResponseEntity<WorkoutPlanDto> getWorkoutById(
            @Parameter(description = "Workout Plan ID", example = "wkt-1")
            @PathVariable("id") String id) {
        WorkoutPlanDto workout = workoutService.getWorkoutById(id);
        return ResponseEntity.ok(workout);
    }

    @Operation(summary = "Generate AI Workout Plan", description = "Generates a customized workout split based on user goal, time availability, equipment, and difficulty.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "AI Workout plan generated successfully",
                    content = @Content(schema = @Schema(implementation = WorkoutPlanDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request payload")
    })
    @PostMapping("/workouts/generate")
    public ResponseEntity<WorkoutPlanDto> generateAIWorkout(@Valid @RequestBody WorkoutGenerateRequestDto requestDto) {
        WorkoutPlanDto generated = workoutService.generateAIWorkout(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(generated);
    }

    @Operation(summary = "Finish Live Workout Session", description = "Submits completed live workout session metrics to award XP, coins, and update workout streaks.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Workout session finished and rewarded successfully",
                    content = @Content(schema = @Schema(implementation = WorkoutSessionFinishResponseDto.class)))
    })
    @PostMapping("/workout-session/finish")
    public ResponseEntity<WorkoutSessionFinishResponseDto> finishWorkoutSession(
            @RequestBody(required = false) WorkoutSessionFinishRequestDto body,
            @RequestParam(name = "workout_id", required = false, defaultValue = "wkt-1") String workoutId,
            @RequestParam(name = "duration", required = false, defaultValue = "2700") Integer duration,
            @RequestParam(name = "calories", required = false, defaultValue = "420") Integer calories,
            @RequestParam(name = "completed_pct", required = false, defaultValue = "100.0") Double completedPct) {
        
        String finalWktId = (body != null && body.getWorkoutId() != null) ? body.getWorkoutId() : workoutId;
        Integer finalDuration = (body != null && body.getDurationMinutes() != null) ? body.getDurationMinutes() * 60 : duration;
        Integer finalCalories = (body != null && body.getCaloriesBurned() != null) ? body.getCaloriesBurned() : calories;

        WorkoutSessionFinishResponseDto response = workoutService.finishWorkoutSession(finalWktId, finalDuration, finalCalories, completedPct);
        return ResponseEntity.ok(response);
    }
}
