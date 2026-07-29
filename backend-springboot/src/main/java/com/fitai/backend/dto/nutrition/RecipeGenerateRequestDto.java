package com.fitai.backend.dto.nutrition;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "AI Recipe Generation Request Data Transfer Object")
public class RecipeGenerateRequestDto {

    @NotBlank(message = "Ingredients list cannot be blank")
    @Schema(description = "Comma-separated available ingredients", example = "Chicken breast, eggs, spinach, avocado")
    private String ingredients;

    public RecipeGenerateRequestDto() {
    }

    public RecipeGenerateRequestDto(String ingredients) {
        this.ingredients = ingredients;
    }

    public String getIngredients() { return ingredients; }
    public void setIngredients(String ingredients) { this.ingredients = ingredients; }
}
