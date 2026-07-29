package com.fitai.backend.dto.nutrition;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Meal Logging Request Data Transfer Object")
public class MealLogRequestDto {

    @NotNull(message = "Calories value is required")
    @Min(value = 0, message = "Calories cannot be negative")
    @Schema(description = "Calories in kcal", example = "450")
    private Integer calories;

    @NotNull(message = "Protein value is required")
    @Min(value = 0, message = "Protein cannot be negative")
    @Schema(description = "Protein in grams", example = "30")
    private Integer protein;

    @NotNull(message = "Carbs value is required")
    @Min(value = 0, message = "Carbs cannot be negative")
    @Schema(description = "Carbs in grams", example = "40")
    private Integer carbs;

    @NotNull(message = "Fats value is required")
    @Min(value = 0, message = "Fats cannot be negative")
    @Schema(description = "Fats in grams", example = "12")
    private Integer fats;

    public MealLogRequestDto() {
    }

    public MealLogRequestDto(Integer calories, Integer protein, Integer carbs, Integer fats) {
        this.calories = calories;
        this.protein = protein;
        this.carbs = carbs;
        this.fats = fats;
    }

    public static MealLogRequestDtoBuilder builder() {
        return new MealLogRequestDtoBuilder();
    }

    public Integer getCalories() { return calories; }
    public void setCalories(Integer calories) { this.calories = calories; }

    public Integer getProtein() { return protein; }
    public void setProtein(Integer protein) { this.protein = protein; }

    public Integer getCarbs() { return carbs; }
    public void setCarbs(Integer carbs) { this.carbs = carbs; }

    public Integer getFats() { return fats; }
    public void setFats(Integer fats) { this.fats = fats; }

    public static class MealLogRequestDtoBuilder {
        private Integer calories;
        private Integer protein;
        private Integer carbs;
        private Integer fats;

        public MealLogRequestDtoBuilder calories(Integer calories) { this.calories = calories; return this; }
        public MealLogRequestDtoBuilder protein(Integer protein) { this.protein = protein; return this; }
        public MealLogRequestDtoBuilder carbs(Integer carbs) { this.carbs = carbs; return this; }
        public MealLogRequestDtoBuilder fats(Integer fats) { this.fats = fats; return this; }

        public MealLogRequestDto build() {
            return new MealLogRequestDto(calories, protein, carbs, fats);
        }
    }
}
