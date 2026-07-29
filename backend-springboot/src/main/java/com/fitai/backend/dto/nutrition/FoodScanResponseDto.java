package com.fitai.backend.dto.nutrition;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Barcode Food Scanner Response Data Transfer Object")
public class FoodScanResponseDto {

    @Schema(description = "Scanned food item name", example = "Premium Greek Yogurt (Plain)")
    private String name;

    @Schema(description = "Calories in kcal", example = "120")
    private Integer kcal;

    @Schema(description = "Protein in grams", example = "15")
    private Integer protein;

    @Schema(description = "Carbs in grams", example = "6")
    private Integer carbs;

    @Schema(description = "Fats in grams", example = "2")
    private Integer fats;

    public FoodScanResponseDto() {
    }

    public FoodScanResponseDto(String name, Integer kcal, Integer protein, Integer carbs, Integer fats) {
        this.name = name;
        this.kcal = kcal;
        this.protein = protein;
        this.carbs = carbs;
        this.fats = fats;
    }

    public static FoodScanResponseDtoBuilder builder() {
        return new FoodScanResponseDtoBuilder();
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getKcal() { return kcal; }
    public void setKcal(Integer kcal) { this.kcal = kcal; }

    public Integer getProtein() { return protein; }
    public void setProtein(Integer protein) { this.protein = protein; }

    public Integer getCarbs() { return carbs; }
    public void setCarbs(Integer carbs) { this.carbs = carbs; }

    public Integer getFats() { return fats; }
    public void setFats(Integer fats) { this.fats = fats; }

    public static class FoodScanResponseDtoBuilder {
        private String name;
        private Integer kcal;
        private Integer protein;
        private Integer carbs;
        private Integer fats;

        public FoodScanResponseDtoBuilder name(String name) { this.name = name; return this; }
        public FoodScanResponseDtoBuilder kcal(Integer kcal) { this.kcal = kcal; return this; }
        public FoodScanResponseDtoBuilder protein(Integer protein) { this.protein = protein; return this; }
        public FoodScanResponseDtoBuilder carbs(Integer carbs) { this.carbs = carbs; return this; }
        public FoodScanResponseDtoBuilder fats(Integer fats) { this.fats = fats; return this; }

        public FoodScanResponseDto build() {
            return new FoodScanResponseDto(name, kcal, protein, carbs, fats);
        }
    }
}
