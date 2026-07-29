package com.fitai.backend.service.impl;

import com.fitai.backend.dto.nutrition.*;
import com.fitai.backend.service.NutritionService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NutritionServiceImpl implements NutritionService {

    // Mock in-memory state ready for future JPA repository replacement
    private int caloriesToday = 1600;
    private int proteinToday = 110;
    private int carbsToday = 180;
    private int fatsToday = 55;
    private double waterToday = 1.8;

    @Override
    public NutritionSummaryDto getNutritionSummary() {
        return buildSummary();
    }

    @Override
    public NutritionSummaryDto updateWaterIntake(String action) {
        if ("add".equalsIgnoreCase(action)) {
            waterToday = Math.round((waterToday + 0.4) * 10.0) / 10.0;
        } else if ("remove".equalsIgnoreCase(action)) {
            waterToday = Math.max(0.0, Math.round((waterToday - 0.4) * 10.0) / 10.0);
        }
        return buildSummary();
    }

    @Override
    public NutritionSummaryDto logMeal(MealLogRequestDto dto) {
        this.caloriesToday += dto.getCalories();
        this.proteinToday += dto.getProtein();
        this.carbsToday += dto.getCarbs();
        this.fatsToday += dto.getFats();
        return buildSummary();
    }

    @Override
    public RecipeResponseDto generateRecipe(RecipeGenerateRequestDto dto) {
        String ingStr = dto.getIngredients() != null ? dto.getIngredients().trim() : "Chicken, Eggs, Spinach";
        String ingLower = ingStr.toLowerCase();
        String[] items = ingStr.split(",");

        String firstItem = items.length > 0 ? items[0].trim() : "Protein";
        String capitalizedFirst = firstItem.substring(0, 1).toUpperCase() + firstItem.substring(1);

        String name = "AI " + capitalizedFirst + " Macro Power Bowl";
        int kcal = 450;
        int prot = 35;
        int carbs = 30;
        int fats = 12;

        if (ingLower.contains("chicken") || ingLower.contains("turkey")) {
            name = "AI " + capitalizedFirst + " & Veggie Macro Bowl";
            kcal = 490;
            prot = 45;
            carbs = 30;
            fats = 12;
        } else if (ingLower.contains("egg") || ingLower.contains("oat")) {
            name = "AI " + capitalizedFirst + " Power Fuel Scramble";
            kcal = 380;
            prot = 28;
            carbs = 42;
            fats = 14;
        } else if (ingLower.contains("fish") || ingLower.contains("salmon") || ingLower.contains("tuna")) {
            name = "AI Omega-3 " + capitalizedFirst + " Energy Plate";
            kcal = 460;
            prot = 40;
            carbs = 20;
            fats = 18;
        }

        List<String> ingredientsList = List.of(
                "200g " + capitalizedFirst,
                "1 cup Fresh Veggies",
                "1 tbsp Olive Oil",
                "Pinch of Sea Salt & Pepper"
        );

        List<String> stepsList = List.of(
                "Prep and dice " + ingStr + ".",
                "Sauté ingredients over medium heat with 1 tbsp olive oil until tender and cooked through (8 mins).",
                "Season with sea salt, black pepper, and serve warm."
        );

        return RecipeResponseDto.builder()
                .name(name)
                .time("15 min")
                .kcal(kcal)
                .macros(prot + "g Protein · " + carbs + "g Carbs · " + fats + "g Fat")
                .ingredients(ingredientsList)
                .steps(stepsList)
                .whyFits("Tailored macro ratio based on available ingredients (" + ingStr + ") to support muscle recovery and daily nutrition goals.")
                .build();
    }

    @Override
    public FoodScanResponseDto scanFoodBarcode() {
        return FoodScanResponseDto.builder()
                .name("Premium Greek Yogurt (Plain)")
                .kcal(120)
                .protein(15)
                .carbs(6)
                .fats(2)
                .build();
    }

    private NutritionSummaryDto buildSummary() {
        return NutritionSummaryDto.builder()
                .caloriesToday(caloriesToday)
                .proteinToday(proteinToday)
                .carbsToday(carbsToday)
                .fatsToday(fatsToday)
                .waterToday(waterToday)
                .build();
    }
}
