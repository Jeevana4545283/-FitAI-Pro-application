package com.fitai.backend.dto.workout;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "Workout Plan Response Data Transfer Object")
public class WorkoutPlanDto {

    @Schema(description = "Unique workout plan ID", example = "wkt-1")
    private String id;

    @Schema(description = "Workout title", example = "Push Strength")
    private String name;

    @Schema(description = "Detailed workout description", example = "Elite upper body pushing hypertrophy session targeting chest, shoulders, and triceps.")
    private String description;

    @Schema(description = "Workout difficulty level", example = "Intermediate")
    private String difficulty;

    @Schema(description = "Duration in minutes", example = "45")
    private Integer duration;

    @Schema(description = "Estimated total calories burned", example = "420")
    private Integer calories;

    @Schema(description = "Category of workout", example = "Strength")
    private String category;

    @Schema(description = "Required equipment list")
    private List<String> equipment;

    @Schema(description = "Targeted muscle groups list")
    private List<String> muscleGroups;

    @Schema(description = "Lead trainer or AI coach name", example = "Alex Carter")
    private String trainerName;

    @Schema(description = "Historical completion percentage", example = "92")
    private Integer completionPct;

    @Schema(description = "AI rationale for selection", example = "Chest fully recovered. Increase pushing volume by 8% for better results.")
    private String whySelected;

    @Schema(description = "List of exercises in this workout plan")
    private List<ExerciseDto> exercises;

    public WorkoutPlanDto() {
    }

    public WorkoutPlanDto(String id, String name, String description, String difficulty, Integer duration, Integer calories, String category, List<String> equipment, List<String> muscleGroups, String trainerName, Integer completionPct, String whySelected, List<ExerciseDto> exercises) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.difficulty = difficulty;
        this.duration = duration;
        this.calories = calories;
        this.category = category;
        this.equipment = equipment;
        this.muscleGroups = muscleGroups;
        this.trainerName = trainerName;
        this.completionPct = completionPct;
        this.whySelected = whySelected;
        this.exercises = exercises;
    }

    public static WorkoutPlanDtoBuilder builder() {
        return new WorkoutPlanDtoBuilder();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public Integer getCalories() { return calories; }
    public void setCalories(Integer calories) { this.calories = calories; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public List<String> getEquipment() { return equipment; }
    public void setEquipment(List<String> equipment) { this.equipment = equipment; }

    public List<String> getMuscleGroups() { return muscleGroups; }
    public void setMuscleGroups(List<String> muscleGroups) { this.muscleGroups = muscleGroups; }

    public String getTrainerName() { return trainerName; }
    public void setTrainerName(String trainerName) { this.trainerName = trainerName; }

    public Integer getCompletionPct() { return completionPct; }
    public void setCompletionPct(Integer completionPct) { this.completionPct = completionPct; }

    public String getWhySelected() { return whySelected; }
    public void setWhySelected(String whySelected) { this.whySelected = whySelected; }

    public List<ExerciseDto> getExercises() { return exercises; }
    public void setExercises(List<ExerciseDto> exercises) { this.exercises = exercises; }

    public static class WorkoutPlanDtoBuilder {
        private String id;
        private String name;
        private String description;
        private String difficulty;
        private Integer duration;
        private Integer calories;
        private String category;
        private List<String> equipment;
        private List<String> muscleGroups;
        private String trainerName;
        private Integer completionPct;
        private String whySelected;
        private List<ExerciseDto> exercises;

        public WorkoutPlanDtoBuilder id(String id) { this.id = id; return this; }
        public WorkoutPlanDtoBuilder name(String name) { this.name = name; return this; }
        public WorkoutPlanDtoBuilder description(String description) { this.description = description; return this; }
        public WorkoutPlanDtoBuilder difficulty(String difficulty) { this.difficulty = difficulty; return this; }
        public WorkoutPlanDtoBuilder duration(Integer duration) { this.duration = duration; return this; }
        public WorkoutPlanDtoBuilder calories(Integer calories) { this.calories = calories; return this; }
        public WorkoutPlanDtoBuilder category(String category) { this.category = category; return this; }
        public WorkoutPlanDtoBuilder equipment(List<String> equipment) { this.equipment = equipment; return this; }
        public WorkoutPlanDtoBuilder muscleGroups(List<String> muscleGroups) { this.muscleGroups = muscleGroups; return this; }
        public WorkoutPlanDtoBuilder trainerName(String trainerName) { this.trainerName = trainerName; return this; }
        public WorkoutPlanDtoBuilder completionPct(Integer completionPct) { this.completionPct = completionPct; return this; }
        public WorkoutPlanDtoBuilder whySelected(String whySelected) { this.whySelected = whySelected; return this; }
        public WorkoutPlanDtoBuilder exercises(List<ExerciseDto> exercises) { this.exercises = exercises; return this; }

        public WorkoutPlanDto build() {
            return new WorkoutPlanDto(id, name, description, difficulty, duration, calories, category, equipment, muscleGroups, trainerName, completionPct, whySelected, exercises);
        }
    }
}
