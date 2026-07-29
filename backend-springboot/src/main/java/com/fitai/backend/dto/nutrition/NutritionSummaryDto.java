package com.fitai.backend.dto.nutrition;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Nutrition Summary Response Data Transfer Object")
public class NutritionSummaryDto {

    @Schema(description = "Total calories consumed today in kcal", example = "1600")
    private Integer caloriesToday;

    @Schema(description = "Total protein consumed today in grams", example = "110")
    private Integer proteinToday;

    @Schema(description = "Total carbs consumed today in grams", example = "180")
    private Integer carbsToday;

    @Schema(description = "Total fats consumed today in grams", example = "55")
    private Integer fatsToday;

    @Schema(description = "Total water consumed today in Liters", example = "1.8")
    private Double waterToday;

    public NutritionSummaryDto() {
    }

    public NutritionSummaryDto(Integer caloriesToday, Integer proteinToday, Integer carbsToday, Integer fatsToday, Double waterToday) {
        this.caloriesToday = caloriesToday;
        this.proteinToday = proteinToday;
        this.carbsToday = carbsToday;
        this.fatsToday = fatsToday;
        this.waterToday = waterToday;
    }

    public static NutritionSummaryDtoBuilder builder() {
        return new NutritionSummaryDtoBuilder();
    }

    public Integer getCaloriesToday() { return caloriesToday; }
    public void setCaloriesToday(Integer caloriesToday) { this.caloriesToday = caloriesToday; }

    public Integer getProteinToday() { return proteinToday; }
    public void setProteinToday(Integer proteinToday) { this.proteinToday = proteinToday; }

    public Integer getCarbsToday() { return carbsToday; }
    public void setCarbsToday(Integer carbsToday) { this.carbsToday = carbsToday; }

    public Integer getFatsToday() { return fatsToday; }
    public void setFatsToday(Integer fatsToday) { this.fatsToday = fatsToday; }

    public Double getWaterToday() { return waterToday; }
    public void setWaterToday(Double waterToday) { this.waterToday = waterToday; }

    public static class NutritionSummaryDtoBuilder {
        private Integer caloriesToday;
        private Integer proteinToday;
        private Integer carbsToday;
        private Integer fatsToday;
        private Double waterToday;

        public NutritionSummaryDtoBuilder caloriesToday(Integer caloriesToday) { this.caloriesToday = caloriesToday; return this; }
        public NutritionSummaryDtoBuilder proteinToday(Integer proteinToday) { this.proteinToday = proteinToday; return this; }
        public NutritionSummaryDtoBuilder carbsToday(Integer carbsToday) { this.carbsToday = carbsToday; return this; }
        public NutritionSummaryDtoBuilder fatsToday(Integer fatsToday) { this.fatsToday = fatsToday; return this; }
        public NutritionSummaryDtoBuilder waterToday(Double waterToday) { this.waterToday = waterToday; return this; }

        public NutritionSummaryDto build() {
            return new NutritionSummaryDto(caloriesToday, proteinToday, carbsToday, fatsToday, waterToday);
        }
    }
}
