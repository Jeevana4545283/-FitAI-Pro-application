package com.fitai.backend.service.impl;

import com.fitai.backend.dto.workout.*;
import com.fitai.backend.exception.ResourceNotFoundException;
import com.fitai.backend.service.WorkoutService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class WorkoutServiceImpl implements WorkoutService {

    private final List<WorkoutPlanDto> defaultWorkouts = new ArrayList<>();

    public WorkoutServiceImpl() {
        initDefaultWorkouts();
    }

    private void initDefaultWorkouts() {
        // Workout 1: Push Strength
        WorkoutPlanDto pushWorkout = WorkoutPlanDto.builder()
                .id("wkt-1")
                .name("Push Strength")
                .description("Elite upper body pushing hypertrophy session targeting chest, shoulders, and triceps.")
                .difficulty("Intermediate")
                .duration(45)
                .calories(420)
                .category("Strength")
                .equipment(List.of("Dumbbells", "Barbell"))
                .muscleGroups(List.of("Chest", "Shoulders", "Triceps"))
                .trainerName("Alex Carter")
                .completionPct(92)
                .whySelected("Chest fully recovered. Increase pushing volume by 8% for better results.")
                .exercises(List.of(
                        ExerciseDto.builder()
                                .id("ex-1")
                                .name("Barbell Bench Press")
                                .sets(4)
                                .reps("8-10")
                                .weight(80.0)
                                .restTime(60)
                                .targetMuscle("Chest")
                                .coachTips("Keep shoulder blades retracted and drive from heels.")
                                .kcal(120)
                                .build(),
                        ExerciseDto.builder()
                                .id("ex-2")
                                .name("Incline Dumbbell Press")
                                .sets(3)
                                .reps("10-12")
                                .weight(32.0)
                                .restTime(60)
                                .targetMuscle("Chest • Shoulders")
                                .coachTips("Control the negative phase down to upper chest.")
                                .kcal(90)
                                .build(),
                        ExerciseDto.builder()
                                .id("ex-3")
                                .name("Cable Fly")
                                .sets(3)
                                .reps("12-15")
                                .weight(15.0)
                                .restTime(45)
                                .targetMuscle("Chest")
                                .coachTips("Squeeze at peak contraction and avoid using momentum.")
                                .kcal(75)
                                .build(),
                        ExerciseDto.builder()
                                .id("ex-4")
                                .name("Rope Tricep Pushdown")
                                .sets(3)
                                .reps("12-15")
                                .weight(22.0)
                                .restTime(45)
                                .targetMuscle("Triceps")
                                .coachTips("Keep elbows locked by your ribs and flare rope at bottom.")
                                .kcal(60)
                                .build()
                ))
                .build();

        // Workout 2: HIIT Cardio Shred
        WorkoutPlanDto hiitWorkout = WorkoutPlanDto.builder()
                .id("wkt-2")
                .name("HIIT Cardio Shred")
                .description("High-intensity interval training designed to accelerate metabolic burn and conditioning.")
                .difficulty("Advanced")
                .duration(30)
                .calories(360)
                .category("HIIT")
                .equipment(List.of("Kettlebell", "Bodyweight"))
                .muscleGroups(List.of("Full Body", "Core", "Quads"))
                .trainerName("Sara Vance")
                .completionPct(88)
                .whySelected("High cardio conditioning interval to optimize fat oxidation.")
                .exercises(List.of(
                        ExerciseDto.builder()
                                .id("ex-5")
                                .name("Jumping Jacks")
                                .sets(4)
                                .reps("45s")
                                .weight(0.0)
                                .restTime(15)
                                .targetMuscle("Full Body")
                                .coachTips("Maintain steady explosive rhythm.")
                                .kcal(60)
                                .build(),
                        ExerciseDto.builder()
                                .id("ex-6")
                                .name("Kettlebell Swings")
                                .sets(4)
                                .reps("20 reps")
                                .weight(16.0)
                                .restTime(30)
                                .targetMuscle("Posterior Chain")
                                .coachTips("Hinge at hips and snap glutes forward.")
                                .kcal(110)
                                .build(),
                        ExerciseDto.builder()
                                .id("ex-7")
                                .name("Mountain Climbers")
                                .sets(4)
                                .reps("45s")
                                .weight(0.0)
                                .restTime(15)
                                .targetMuscle("Core • Cardio")
                                .coachTips("Keep hips flat and knees driving to chest.")
                                .kcal(80)
                                .build()
                ))
                .build();

        defaultWorkouts.add(pushWorkout);
        defaultWorkouts.add(hiitWorkout);
    }

    @Override
    public List<WorkoutPlanDto> getAllWorkouts(String category, String query) {
        return defaultWorkouts.stream()
                .filter(w -> category == null || category.isBlank() || w.getCategory().equalsIgnoreCase(category))
                .filter(w -> query == null || query.isBlank() || w.getName().toLowerCase().contains(query.toLowerCase()) || w.getDescription().toLowerCase().contains(query.toLowerCase()))
                .collect(Collectors.toList());
    }

    @Override
    public WorkoutPlanDto getWorkoutById(String id) {
        return defaultWorkouts.stream()
                .filter(w -> w.getId().equalsIgnoreCase(id))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Workout plan not found with ID: " + id));
    }

    @Override
    public WorkoutPlanDto generateAIWorkout(WorkoutGenerateRequestDto dto) {
        boolean isHypertrophy = dto.getGoal() != null && dto.getGoal().toLowerCase().contains("muscle");
        String name = isHypertrophy ? "AI Hypertrophy Split" : "AI Cardio Shred";
        int duration = dto.getTime() != null ? dto.getTime() : 45;
        int kcal = duration * 9;
        String difficulty = dto.getDifficulty() != null ? dto.getDifficulty() : "Intermediate";

        List<ExerciseDto> exercises = List.of(
                ExerciseDto.builder()
                        .id("ex-ai-1")
                        .name(isHypertrophy ? "Dumbbell Chest Press" : "Jumping Jacks")
                        .sets(3)
                        .reps(isHypertrophy ? "10-12" : "45s")
                        .weight(isHypertrophy ? 24.0 : 0.0)
                        .restTime(45)
                        .targetMuscle(isHypertrophy ? "Chest" : "Full Body")
                        .coachTips("Control tempo for maximum hypertrophy.")
                        .kcal(80)
                        .build(),
                ExerciseDto.builder()
                        .id("ex-ai-2")
                        .name(isHypertrophy ? "Goblet Squats" : "Kettlebell Swings")
                        .sets(3)
                        .reps(isHypertrophy ? "12-15" : "20 reps")
                        .weight(18.0)
                        .restTime(60)
                        .targetMuscle("Lower Body")
                        .coachTips("Keep chest high and knees tracking over toes.")
                        .kcal(110)
                        .build(),
                ExerciseDto.builder()
                        .id("ex-ai-3")
                        .name(isHypertrophy ? "Dumbbell Bent-Over Row" : "Mountain Climbers")
                        .sets(3)
                        .reps("12")
                        .weight(isHypertrophy ? 20.0 : 0.0)
                        .restTime(45)
                        .targetMuscle("Back")
                        .coachTips("Pull elbows toward hips and squeeze lats.")
                        .kcal(70)
                        .build()
        );

        WorkoutPlanDto generated = WorkoutPlanDto.builder()
                .id("wkt-gen-" + UUID.randomUUID().toString().substring(0, 8))
                .name(name)
                .description("Custom AI program optimized for " + dto.getGoal() + " within " + duration + " minutes.")
                .difficulty(difficulty)
                .duration(duration)
                .calories(kcal)
                .category(isHypertrophy ? "Strength" : "Cardio")
                .equipment(dto.getEquip() != null ? dto.getEquip() : List.of("Dumbbells"))
                .muscleGroups(List.of("Chest", "Lower Body", "Back"))
                .trainerName("FitAI Engine 3.x")
                .completionPct(100)
                .whySelected("Based on your goal (" + dto.getGoal() + ") and equipment selection, this program maximizes work volume safely.")
                .exercises(exercises)
                .build();

        defaultWorkouts.add(generated);
        return generated;
    }

    @Override
    public WorkoutSessionFinishResponseDto finishWorkoutSession(String workoutId, Integer duration, Integer calories, Double completedPct) {
        int cal = calories != null ? calories : 420;
        int dur = duration != null ? duration : 2700;
        double pct = completedPct != null ? completedPct : 100.0;

        int xpEarned = cal + 50;
        int coinsEarned = Math.round(cal / 10.0f);

        return WorkoutSessionFinishResponseDto.builder()
                .workoutId(workoutId != null ? workoutId : "wkt-1")
                .duration(dur)
                .calories(cal)
                .completedPct(pct)
                .xpEarned(xpEarned)
                .coinsEarned(coinsEarned)
                .updatedStreak(25)
                .message(String.format("Workout complete! You earned +%d XP and +%d coins. Streak: 25 days!", xpEarned, coinsEarned))
                .build();
    }
}
