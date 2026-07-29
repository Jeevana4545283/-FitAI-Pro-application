package com.fitai.backend.controller;

import com.fitai.backend.dto.nutrition.*;
import com.fitai.backend.service.NutritionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/nutrition")
@Tag(name = "Nutrition & Hydration", description = "Endpoints for tracking calories, macros, water intake, AI recipe generator, and food scanner")
public class NutritionController {

    private final NutritionService nutritionService;

    @Autowired
    public NutritionController(NutritionService nutritionService) {
        this.nutritionService = nutritionService;
    }

    @Operation(summary = "Get Daily Nutrition Summary", description = "Retrieves today's total calories, protein, carbs, fats, and water intake.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Nutrition summary retrieved successfully",
                    content = @Content(schema = @Schema(implementation = NutritionSummaryDto.class)))
    })
    @GetMapping
    public ResponseEntity<NutritionSummaryDto> getNutritionSummary() {
        NutritionSummaryDto summary = nutritionService.getNutritionSummary();
        return ResponseEntity.ok(summary);
    }

    @Operation(summary = "Update Water Intake", description = "Increments or decrements daily water intake by 0.4 Liters.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Water intake updated successfully",
                    content = @Content(schema = @Schema(implementation = NutritionSummaryDto.class)))
    })
    @PostMapping("/water")
    public ResponseEntity<NutritionSummaryDto> updateWaterIntake(
            @Parameter(description = "Action: 'add' or 'remove'", example = "add")
            @RequestParam(name = "action", defaultValue = "add") String action) {
        NutritionSummaryDto updatedSummary = nutritionService.updateWaterIntake(action);
        return ResponseEntity.ok(updatedSummary);
    }

    @Operation(summary = "Log Meal Intake", description = "Logs calories, protein, carbs, and fats to daily totals.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Meal logged successfully",
                    content = @Content(schema = @Schema(implementation = NutritionSummaryDto.class))),
            @ApiResponse(responseCode = "400", description = "Validation error in meal payload")
    })
    @PostMapping("/meal")
    public ResponseEntity<NutritionSummaryDto> logMeal(@Valid @RequestBody MealLogRequestDto mealLogRequestDto) {
        NutritionSummaryDto updatedSummary = nutritionService.logMeal(mealLogRequestDto);
        return ResponseEntity.ok(updatedSummary);
    }

    @Operation(summary = "Generate AI Recipe", description = "Generates a customized high-protein recipe based on available fridge ingredients.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Recipe generated successfully",
                    content = @Content(schema = @Schema(implementation = RecipeResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid ingredients payload")
    })
    @PostMapping("/recipe/generate")
    public ResponseEntity<RecipeResponseDto> generateRecipe(@Valid @RequestBody RecipeGenerateRequestDto requestDto) {
        RecipeResponseDto recipe = nutritionService.generateRecipe(requestDto);
        return ResponseEntity.ok(recipe);
    }

    @Operation(summary = "Scan Food Barcode", description = "Simulates barcode scanning to recognize food nutritional facts.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Food item recognized successfully",
                    content = @Content(schema = @Schema(implementation = FoodScanResponseDto.class)))
    })
    @PostMapping("/barcode/scan")
    public ResponseEntity<FoodScanResponseDto> scanFoodBarcode() {
        FoodScanResponseDto scanResult = nutritionService.scanFoodBarcode();
        return ResponseEntity.ok(scanResult);
    }
}
