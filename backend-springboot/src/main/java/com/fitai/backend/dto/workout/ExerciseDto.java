package com.fitai.backend.dto.workout;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Exercise Details Data Transfer Object")
public class ExerciseDto {

    @Schema(description = "Unique exercise identifier", example = "ex-1")
    private String id;

    @Schema(description = "Exercise name", example = "Barbell Bench Press")
    private String name;

    @Schema(description = "Number of sets", example = "4")
    private Integer sets;

    @Schema(description = "Target reps or time string", example = "8-10")
    private String reps;

    @Schema(description = "Recommended weight in kg", example = "80.0")
    private Double weight;

    @Schema(description = "Rest time between sets in seconds", example = "60")
    private Integer restTime;

    @Schema(description = "Target muscle group", example = "Chest")
    private String targetMuscle;

    @Schema(description = "Pro coach tips for execution", example = "Keep shoulder blades retracted and drive from heels.")
    private String coachTips;

    @Schema(description = "Estimated calories burned for this exercise", example = "120")
    private Integer kcal;

    public ExerciseDto() {
    }

    public ExerciseDto(String id, String name, Integer sets, String reps, Double weight, Integer restTime, String targetMuscle, String coachTips, Integer kcal) {
        this.id = id;
        this.name = name;
        this.sets = sets;
        this.reps = reps;
        this.weight = weight;
        this.restTime = restTime;
        this.targetMuscle = targetMuscle;
        this.coachTips = coachTips;
        this.kcal = kcal;
    }

    public static ExerciseDtoBuilder builder() {
        return new ExerciseDtoBuilder();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getSets() { return sets; }
    public void setSets(Integer sets) { this.sets = sets; }

    public String getReps() { return reps; }
    public void setReps(String reps) { this.reps = reps; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public Integer getRestTime() { return restTime; }
    public void setRestTime(Integer restTime) { this.restTime = restTime; }

    public String getTargetMuscle() { return targetMuscle; }
    public void setTargetMuscle(String targetMuscle) { this.targetMuscle = targetMuscle; }

    public String getCoachTips() { return coachTips; }
    public void setCoachTips(String coachTips) { this.coachTips = coachTips; }

    public Integer getKcal() { return kcal; }
    public void setKcal(Integer kcal) { this.kcal = kcal; }

    public static class ExerciseDtoBuilder {
        private String id;
        private String name;
        private Integer sets;
        private String reps;
        private Double weight;
        private Integer restTime;
        private String targetMuscle;
        private String coachTips;
        private Integer kcal;

        public ExerciseDtoBuilder id(String id) { this.id = id; return this; }
        public ExerciseDtoBuilder name(String name) { this.name = name; return this; }
        public ExerciseDtoBuilder sets(Integer sets) { this.sets = sets; return this; }
        public ExerciseDtoBuilder reps(String reps) { this.reps = reps; return this; }
        public ExerciseDtoBuilder weight(Double weight) { this.weight = weight; return this; }
        public ExerciseDtoBuilder restTime(Integer restTime) { this.restTime = restTime; return this; }
        public ExerciseDtoBuilder targetMuscle(String targetMuscle) { this.targetMuscle = targetMuscle; return this; }
        public ExerciseDtoBuilder coachTips(String coachTips) { this.coachTips = coachTips; return this; }
        public ExerciseDtoBuilder kcal(Integer kcal) { this.kcal = kcal; return this; }

        public ExerciseDto build() {
            return new ExerciseDto(id, name, sets, reps, weight, restTime, targetMuscle, coachTips, kcal);
        }
    }
}
