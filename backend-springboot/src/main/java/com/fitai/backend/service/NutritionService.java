package com.fitai.backend.service;

import com.fitai.backend.dto.nutrition.*;

public interface NutritionService {

    NutritionSummaryDto getNutritionSummary();

    NutritionSummaryDto updateWaterIntake(String action);

    NutritionSummaryDto logMeal(MealLogRequestDto mealLogRequestDto);

    RecipeResponseDto generateRecipe(RecipeGenerateRequestDto requestDto);

    FoodScanResponseDto scanFoodBarcode();
}
