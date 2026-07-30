from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

try:
    from core.database import prisma
except ImportError:
    from backend.core.database import prisma

router = APIRouter(prefix="/api/v1", tags=["workouts"])

# --- Models & Schemas ---
class ExerciseCreate(BaseModel):
    name: str
    sets: int
    reps: str
    weight: Optional[float] = None
    restTime: int
    videoUrl: Optional[str] = None
    coachTips: Optional[str] = None
    targetMuscle: str
    order: int

class WorkoutCreate(BaseModel):
    name: str
    description: Optional[str] = None
    difficulty: str
    duration: int
    calories: int
    equipment: List[str]
    muscleGroups: List[str]
    trainerId: Optional[str] = None
    categoryId: Optional[str] = None
    exercises: List[ExerciseCreate]

class FinishSessionRequest(BaseModel):
    workout_id: str
    duration: int # in seconds
    calories: int
    completed_pct: float

# --- API Endpoints ---

@router.get("/workout-categories")
async def get_workout_categories():
    """Fetch workout categories list from PostgreSQL database."""
    if prisma.is_connected():
        return await prisma.workoutcategory.find_many()
    raise HTTPException(status_code=500, detail="Database connection unavailable.")

@router.get("/workouts")
async def get_workouts(
    muscle_group: Optional[str] = None,
    difficulty: Optional[str] = None,
    duration: Optional[str] = None
):
    """Retrieve all workouts from PostgreSQL (supports filtering)."""
    if not prisma.is_connected():
        raise HTTPException(status_code=500, detail="Database connection unavailable.")

    where_clause = {}
    if muscle_group:
        where_clause["muscleGroups"] = {"has": muscle_group}
    if difficulty:
        where_clause["difficulty"] = difficulty

    db_workouts = await prisma.workout.find_many(
        where=where_clause,
        include={"exercises": True, "trainer": True, "category": True}
    )
    return db_workouts

@router.get("/workouts/{workout_id}")
async def get_workout(workout_id: str):
    """Fetch details of a single workout plan from PostgreSQL."""
    if not prisma.is_connected():
        raise HTTPException(status_code=500, detail="Database connection unavailable.")

    db_wkt = await prisma.workout.find_unique(
        where={"id": workout_id},
        include={"exercises": True, "trainer": True, "category": True}
    )
    if db_wkt:
        return db_wkt
    raise HTTPException(status_code=404, detail="Workout not found")

@router.post("/workouts", status_code=status.HTTP_201_CREATED)
async def create_workout(workout: WorkoutCreate):
    """Submit and store a custom workout plan in PostgreSQL."""
    if not prisma.is_connected():
        raise HTTPException(status_code=500, detail="Database connection unavailable.")

    new_wkt = await prisma.workout.create(
        data={
            "name": workout.name,
            "description": workout.description,
            "difficulty": workout.difficulty,
            "duration": workout.duration,
            "calories": workout.calories,
            "equipment": workout.equipment,
            "muscleGroups": workout.muscleGroups,
            "trainerId": workout.trainerId,
            "categoryId": workout.categoryId,
            "exercises": {
                "create": [
                    {
                        "name": ex.name,
                        "sets": ex.sets,
                        "reps": ex.reps,
                        "weight": ex.weight,
                        "restTime": ex.restTime,
                        "videoUrl": ex.videoUrl,
                        "coachTips": ex.coachTips,
                        "targetMuscle": ex.targetMuscle,
                        "order": ex.order
                    }
                    for ex in workout.exercises
                ]
            }
        },
        include={"exercises": True, "trainer": True, "category": True}
    )
    return new_wkt

@router.put("/workouts/{workout_id}")
async def update_workout(workout_id: str, workout: WorkoutCreate):
    """Update details of a custom workout in PostgreSQL."""
    if not prisma.is_connected():
        raise HTTPException(status_code=500, detail="Database connection unavailable.")

    existing = await prisma.workout.find_unique(where={"id": workout_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Workout not found")

    # Delete existing exercises and recreate
    await prisma.exercise.delete_many(where={"workoutId": workout_id})

    updated_wkt = await prisma.workout.update(
        where={"id": workout_id},
        data={
            "name": workout.name,
            "description": workout.description,
            "difficulty": workout.difficulty,
            "duration": workout.duration,
            "calories": workout.calories,
            "equipment": workout.equipment,
            "muscleGroups": workout.muscleGroups,
            "trainerId": workout.trainerId,
            "categoryId": workout.categoryId,
            "exercises": {
                "create": [
                    {
                        "name": ex.name,
                        "sets": ex.sets,
                        "reps": ex.reps,
                        "weight": ex.weight,
                        "restTime": ex.restTime,
                        "videoUrl": ex.videoUrl,
                        "coachTips": ex.coachTips,
                        "targetMuscle": ex.targetMuscle,
                        "order": ex.order
                    }
                    for ex in workout.exercises
                ]
            }
        },
        include={"exercises": True, "trainer": True, "category": True}
    )
    return updated_wkt

@router.delete("/workouts/{workout_id}")
async def delete_workout(workout_id: str):
    """Delete a custom workout from PostgreSQL."""
    if not prisma.is_connected():
        raise HTTPException(status_code=500, detail="Database connection unavailable.")

    existing = await prisma.workout.find_unique(where={"id": workout_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Workout not found")

    await prisma.workout.delete(where={"id": workout_id})
    return {"success": True, "message": "Workout plan deleted successfully from database"}

@router.get("/workout-history")
async def get_workout_history():
    """Fetch completed sessions list from PostgreSQL."""
    if not prisma.is_connected():
        raise HTTPException(status_code=500, detail="Database connection unavailable.")

    history = await prisma.workouthistory.find_many(
        include={"workout": True},
        order={"date": "desc"}
    )
    return history

@router.post("/workout-session/start")
async def start_session(workout_id: str):
    """Initialize a workout session in database."""
    if not prisma.is_connected():
        raise HTTPException(status_code=500, detail="Database connection unavailable.")

    session = await prisma.workoutsession.create(
        data={
            "workoutId": workout_id,
            "status": "active"
        }
    )
    return {
        "sessionId": session.id,
        "workoutId": session.workoutId,
        "startedAt": session.startedAt.isoformat(),
        "status": session.status
    }

@router.post("/workout-session/finish")
async def finish_session(payload: FinishSessionRequest):
    """Conclude workout logging and persist record in PostgreSQL."""
    if not prisma.is_connected():
        raise HTTPException(status_code=500, detail="Database connection unavailable.")

    # Create history log
    log = await prisma.workouthistory.create(
        data={
            "workoutId": payload.workout_id,
            "duration": payload.duration,
            "calories": payload.calories,
            "completedPct": payload.completed_pct
        },
        include={"workout": True}
    )

    return {
        "success": True,
        "session": log,
        "xpEarned": 150,
        "levelUp": payload.completed_pct >= 100.0
    }

# --- Favorite Workouts Endpoints ---

@router.post("/workouts/{workout_id}/favorite")
async def add_favorite_workout(workout_id: str, userId: str = Query(...)):
    """Mark a workout as favorite in PostgreSQL."""
    if not prisma.is_connected():
        raise HTTPException(status_code=500, detail="Database connection unavailable.")

    # Check if existing favorite
    existing = await prisma.favoriteworkout.find_first(
        where={"workoutId": workout_id, "userId": userId}
    )
    if existing:
        return {"success": True, "favoriteId": existing.id, "message": "Already favorited"}

    fav = await prisma.favoriteworkout.create(
        data={"workoutId": workout_id, "userId": userId}
    )
    return {"success": True, "favoriteId": fav.id, "message": "Added to favorites"}

@router.delete("/workouts/{workout_id}/favorite")
async def remove_favorite_workout(workout_id: str, userId: str = Query(...)):
    """Remove a favorite workout from PostgreSQL."""
    if not prisma.is_connected():
        raise HTTPException(status_code=500, detail="Database connection unavailable.")

    await prisma.favoriteworkout.delete_many(
        where={"workoutId": workout_id, "userId": userId}
    )
    return {"success": True, "message": "Removed from favorites"}

@router.get("/favorites")
async def get_user_favorites(userId: str = Query(...)):
    """Fetch user favorite workouts list from PostgreSQL."""
    if not prisma.is_connected():
        raise HTTPException(status_code=500, detail="Database connection unavailable.")

    favs = await prisma.favoriteworkout.find_many(
        where={"userId": userId},
        include={"workout": {"include": {"exercises": True, "trainer": True}}}
    )
    return favs
