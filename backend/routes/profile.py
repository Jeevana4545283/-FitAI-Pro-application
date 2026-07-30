from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel
from typing import List, Optional

try:
    from core.database import prisma
except ImportError:
    from backend.core.database import prisma

router = APIRouter(prefix="/api/v1", tags=["profile"])

# --- Schemas ---
class UserProfileResponse(BaseModel):
    id: str
    name: str
    email: str
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    fitnessGoal: Optional[str] = None
    experience: Optional[str] = None
    workoutPreference: Optional[str] = None
    availableTime: Optional[int] = None
    weeklyDays: Optional[int] = None
    pastInjuries: List[str] = []
    medicalConditions: List[str] = []
    sleepHours: Optional[float] = None
    waterIntake: Optional[float] = None
    activityLevel: Optional[str] = None
    equipment: List[str] = []

class UserProfileUpdate(BaseModel):
    userId: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    fitnessGoal: Optional[str] = None
    experience: Optional[str] = None
    workoutPreference: Optional[str] = None
    availableTime: Optional[int] = None
    weeklyDays: Optional[int] = None
    pastInjuries: Optional[List[str]] = None
    medicalConditions: Optional[List[str]] = None
    sleepHours: Optional[float] = None
    waterIntake: Optional[float] = None
    activityLevel: Optional[str] = None
    equipment: Optional[List[str]] = None

@router.get("/profile")
async def get_profile(userId: Optional[str] = Query(None)):
    """Fetch user profile metadata from PostgreSQL database."""
    if prisma.is_connected():
        user = None
        if userId:
            user = await prisma.user.find_unique(where={"id": userId})
        if not user:
            # Fallback to most recent registered user
            user = await prisma.user.find_first(order={"createdAt": "desc"})

        if user:
            return {
                "id": user.id,
                "name": user.name or "User",
                "email": user.email,
                "age": user.age or 25,
                "gender": user.gender or "Not specified",
                "height": user.height or 175.0,
                "weight": user.weight or 70.0,
                "fitnessGoal": user.fitnessGoal or "Muscle Gain",
                "experience": user.experience or "Intermediate",
                "workoutPreference": user.workoutPreference or "Strength & Hypertrophy",
                "availableTime": user.availableTime or 45,
                "weeklyDays": user.weeklyDays or 4,
                "pastInjuries": user.pastInjuries or [],
                "medicalConditions": user.medicalConditions or [],
                "sleepHours": user.sleepHours or 7.5,
                "waterIntake": user.waterIntake or 2.5,
                "activityLevel": user.activityLevel or "Moderate",
                "equipment": user.equipment or ["Dumbbells", "Barbell"]
            }

    raise HTTPException(status_code=404, detail="User profile not found. Please register first.")

@router.put("/profile")
async def update_profile(profile_data: UserProfileUpdate):
    """Update profile metadata directly in PostgreSQL database."""
    if not prisma.is_connected():
        raise HTTPException(status_code=500, detail="Database connection unavailable.")

    user = None
    if profile_data.userId:
        user = await prisma.user.find_unique(where={"id": profile_data.userId})
    if not user:
        user = await prisma.user.find_first(order={"createdAt": "desc"})

    if not user:
        raise HTTPException(status_code=404, detail="No user profile found to update.")

    update_dict = profile_data.model_dump(exclude_unset=True)
    if "userId" in update_dict:
        del update_dict["userId"]

    updated_user = await prisma.user.update(
        where={"id": user.id},
        data=update_dict
    )

    return {
        "id": updated_user.id,
        "name": updated_user.name,
        "email": updated_user.email,
        "age": updated_user.age,
        "gender": updated_user.gender,
        "height": updated_user.height,
        "weight": updated_user.weight,
        "fitnessGoal": updated_user.fitnessGoal,
        "experience": updated_user.experience,
        "workoutPreference": updated_user.workoutPreference,
        "availableTime": updated_user.availableTime,
        "weeklyDays": updated_user.weeklyDays,
        "pastInjuries": updated_user.pastInjuries,
        "medicalConditions": updated_user.medicalConditions,
        "sleepHours": updated_user.sleepHours,
        "waterIntake": updated_user.waterIntake,
        "activityLevel": updated_user.activityLevel,
        "equipment": updated_user.equipment
    }
