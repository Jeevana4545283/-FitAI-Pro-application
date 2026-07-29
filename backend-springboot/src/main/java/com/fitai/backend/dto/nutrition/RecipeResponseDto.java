package com.fitai.backend.dto.nutrition;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "AI Recipe Generation Response Data Transfer Object")
public class RecipeResponseDto {

    @Schema(description = "Recipe title", example = "AI High-Protein Avocado Scramble")
    private String name;

    @Schema(description = "Estimated preparation time", example = "15 min")
    private String time;

    @Schema(description = "Total recipe calories in kcal", example = "480")
    private Integer kcal;

    @Schema(description = "Macro summary string", example = "35g Protein · 12g Carbs · 28g Fat")
    private String macros;

    @Schema(description = "List of recipe ingredients")
    private List<String> ingredients;

    @Schema(description = "Step by step cooking preparation steps")
    private List<String> steps;

    @Schema(description = "AI rationale for how this fits current recovery and macros", example = "High protein speeds up chest repair...")
    private String whyFits;

    public RecipeResponseDto() {
    }

    public RecipeResponseDto(String name, String time, Integer kcal, String macros, List<String> ingredients, List<String> steps, String whyFits) {
        this.name = name;
        this.time = time;
        this.kcal = kcal;
        this.macros = macros;
        this.ingredients = ingredients;
        this.steps = steps;
        this.whyFits = whyFits;
    }

    public static RecipeResponseDtoBuilder builder() {
        return new RecipeResponseDtoBuilder();
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public Integer getKcal() { return kcal; }
    public void setKcal(Integer kcal) { this.kcal = kcal; }

    public String getMacros() { return macros; }
    public void setMacros(String macros) { this.macros = macros; }

    public List<String> getIngredients() { return ingredients; }
    public void setIngredients(List<String> ingredients) { this.ingredients = ingredients; }

    public List<String> getSteps() { return steps; }
    public void setSteps(List<String> steps) { this.steps = steps; }

    public String getWhyFits() { return whyFits; }
    public void setWhyFits(String whyFits) { this.whyFits = whyFits; }

    public static class RecipeResponseDtoBuilder {
        private String name;
        private String time;
        private Integer kcal;
        private String macros;
        private List<String> ingredients;
        private List<String> steps;
        private String whyFits;

        public RecipeResponseDtoBuilder name(String name) { this.name = name; return this; }
        public RecipeResponseDtoBuilder time(String time) { this.time = time; return this; }
        public RecipeResponseDtoBuilder kcal(Integer kcal) { this.kcal = kcal; return this; }
        public RecipeResponseDtoBuilder macros(String macros) { this.macros = macros; return this; }
        public RecipeResponseDtoBuilder ingredients(List<String> ingredients) { this.ingredients = ingredients; return this; }
        public RecipeResponseDtoBuilder steps(List<String> steps) { this.steps = steps; return this; }
        public RecipeResponseDtoBuilder whyFits(String whyFits) { this.whyFits = whyFits; return this; }

        public RecipeResponseDto build() {
            return new RecipeResponseDto(name, time, kcal, macros, ingredients, steps, whyFits);
        }
    }
}
