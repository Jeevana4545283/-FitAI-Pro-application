from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional

try:
    from core.database import prisma
except ImportError:
    from backend.core.database import prisma

router = APIRouter(prefix="/api/v1", tags=["profile"])

# --- Schemas ---
class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    experience: Optional[str] = None
    gymHome: Optional[str] = None
    availableTime: Optional[int] = None

# --- Mock Data ---
MOCK_PROFILE = {
    "name": "Priyanshi Sharma",
    "email": "priyanshi@email.com",
    "height": 168.0,
    "weight": 61.4,
    "age": 27,
    "gender": "Female",
    "experience": "Intermediate",
    "gymHome": "gym",
    "availableTime": 45,
}

@router.get("/profile")
async def get_profile():
    """Fetch user profile metadata."""
    if prisma.is_connected():
        try:
            # Attempt to read first user
            user = await prisma.user.find_first()
            if user:
                return {
                    "name": user.name or MOCK_PROFILE["name"],
                    "email": user.email,
                    "height": MOCK_PROFILE["height"],
                    "weight": MOCK_PROFILE["weight"],
                    "age": MOCK_PROFILE["age"],
                    "gender": MOCK_PROFILE["gender"],
                    "experience": MOCK_PROFILE["experience"],
                    "gymHome": MOCK_PROFILE["gymHome"],
                    "availableTime": MOCK_PROFILE["availableTime"]
                }
        except Exception:
            pass
    return MOCK_PROFILE

@router.put("/profile")
async def update_profile(profile_data: UserProfileUpdate):
    """Update profile metadata."""
    global MOCK_PROFILE
    updated_dict = profile_data.model_dump(exclude_unset=True)
    MOCK_PROFILE.update(updated_dict)
    
    if prisma.is_connected():
        try:
            user = await prisma.user.find_first()
            if user:
                await prisma.user.update(
                    where={"id": user.id},
                    data={"name": MOCK_PROFILE["name"]}
                )
        except Exception:
            pass
            
    return MOCK_PROFILE
