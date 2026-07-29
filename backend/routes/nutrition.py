from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/v1/nutrition", tags=["nutrition"])

# --- Schemas ---
class MealLogCreate(BaseModel):
    calories: int
    protein: int
    carbs: int
    fats: int

# --- Mock State ---
MOCK_NUTRITION = {
    "caloriesToday": 1600,
    "proteinToday": 110,
    "carbsToday": 180,
    "fatsToday": 55,
    "waterToday": 1.8, # in liters
}

@router.get("")
async def get_nutrition():
    """Fetch current nutrition status."""
    return MOCK_NUTRITION

@router.post("/meal")
async def log_meal(meal: MealLogCreate):
    """Log a meal to dashboard tracker."""
    global MOCK_NUTRITION
    MOCK_NUTRITION["caloriesToday"] += meal.calories
    MOCK_NUTRITION["proteinToday"] += meal.protein
    MOCK_NUTRITION["carbsToday"] += meal.carbs
    MOCK_NUTRITION["fatsToday"] += meal.fats
    return MOCK_NUTRITION

@router.post("/water")
async def log_water(action: str):
    """Log water intake. action can be 'add' or 'remove'."""
    global MOCK_NUTRITION
    if action == "add":
        MOCK_NUTRITION["waterToday"] = round(MOCK_NUTRITION["waterToday"] + 0.4, 1)
    elif action == "remove":
        MOCK_NUTRITION["waterToday"] = max(0.0, round(MOCK_NUTRITION["waterToday"] - 0.4, 1))
    return MOCK_NUTRITION
