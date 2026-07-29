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

# --- Static/Mock Data Fallbacks ---
MOCK_CATEGORIES = [
    {"id": "cat-1", "name": "Strength", "icon": "Dumbbell"},
    {"id": "cat- push", "name": "Push", "icon": "ArrowRight"},
    {"id": "cat- pull", "name": "Pull", "icon": "Zap"},
    {"id": "cat- legs", "name": "Legs", "icon": "Activity"},
    {"id": "cat-2", "name": "Cardio", "icon": "Flame"},
    {"id": "cat-3", "name": "HIIT", "icon": "Zap"},
    {"id": "cat-4", "name": "Mobility", "icon": "Compass"},
    {"id": "cat-5", "name": "Recovery", "icon": "Heart"},
]

MOCK_TRAINERS = [
    {"id": "trn-1", "name": "Alex Carter", "avatar": "A"},
    {"id": "trn-2", "name": "Sarah Jenkins", "avatar": "S"},
]

MOCK_WORKOUTS = [
    {
        "id": "wkt-1",
        "name": "Push Strength",
        "description": "Elite upper body pushing hypertrophy session targeting chest, shoulders, and triceps.",
        "difficulty": "Intermediate",
        "duration": 45,
        "calories": 420,
        "equipment": ["Dumbbells", "Barbell"],
        "muscleGroups": ["Chest", "Shoulders", "Triceps"],
        "trainerId": "trn-1",
        "trainerName": "Alex Carter",
        "completionPct": 92,
        "exercises": [
            {"id": "ex-1", "name": "Barbell Bench Press", "sets": 4, "reps": "8-10", "weight": 80.0, "restTime": 60, "videoUrl": "", "coachTips": "Keep shoulder blades retracted and drive from heels.", "targetMuscle": "Chest", "order": 1},
            {"id": "ex-2", "name": "Incline Dumbbell Press", "sets": 3, "reps": "10-12", "weight": 32.0, "restTime": 60, "videoUrl": "", "coachTips": "Control the negative phase down to upper chest.", "targetMuscle": "Chest", "order": 2},
            {"id": "ex-3", "name": "Cable Fly", "sets": 3, "reps": "12-15", "weight": 15.0, "restTime": 45, "videoUrl": "", "coachTips": "Squeeze at peak contraction and avoid using momentum.", "targetMuscle": "Chest", "order": 3},
            {"id": "ex-4", "name": "Rope Tricep Pushdown", "sets": 3, "reps": "12-15", "weight": 22.0, "restTime": 45, "videoUrl": "", "coachTips": "Keep elbows locked by your ribs and flare rope at bottom.", "targetMuscle": "Triceps", "order": 4},
        ]
    },
    {
        "id": "wkt-2",
        "name": "Leg Hypertrophy",
        "description": "Posterior chain focus for maximal growth.",
        "difficulty": "Advanced",
        "duration": 60,
        "calories": 520,
        "equipment": ["Barbell", "Machines"],
        "muscleGroups": ["Quads", "Hamstrings", "Glutes"],
        "trainerId": "trn-2",
        "trainerName": "Sarah Jenkins",
        "completionPct": 0,
        "exercises": [
            {"id": "ex-5", "name": "Barbell Squats", "sets": 4, "reps": "6-8", "weight": 100.0, "restTime": 90, "videoUrl": "", "coachTips": "Squat to parallel or lower; drive upwards with hips.", "targetMuscle": "Quads", "order": 1},
            {"id": "ex-6", "name": "Romanian Deadlifts", "sets": 3, "reps": "10-12", "weight": 70.0, "restTime": 75, "videoUrl": "", "coachTips": "Hinge at hips, keep back neutral, feel stretch in hamstrings.", "targetMuscle": "Hamstrings", "order": 2},
        ]
    }
]

MOCK_HISTORY = [
    {
        "id": "hist-1",
        "workoutName": "Push Strength",
        "duration": 2700,
        "calories": 420,
        "completedPct": 100.0,
        "date": datetime.now().isoformat()
    }
]

MOCK_FAVORITES = []

# --- API Endpoints ---

@router.get("/workout-categories")
async def get_workout_categories():
    """Fetch workout categories list."""
    if prisma.is_connected():
        try:
            db_cats = await prisma.workoutcategory.find_many()
            return db_cats
        except Exception:
            pass
    return MOCK_CATEGORIES

@router.get("/workouts")
async def get_workouts(
    muscle_group: Optional[str] = None,
    difficulty: Optional[str] = None,
    duration: Optional[str] = None
):
    """Retrieve all workouts (supports filtering)."""
    if prisma.is_connected():
        try:
            # Construct standard Prisma query
            where_clause = {}
            if muscle_group:
                where_clause["muscleGroups"] = {"has": muscle_group}
            if difficulty:
                where_clause["difficulty"] = difficulty
            
            db_workouts = await prisma.workout.find_many(
                where=where_clause,
                include={"trainer": True, "category": True}
            )
            return db_workouts
        except Exception:
            pass
            
    # Fallback to Mock
    results = MOCK_WORKOUTS
    if muscle_group:
        results = [w for w in results if any(muscle_group.lower() in m.lower() for m in w["muscleGroups"])]
    if difficulty:
        results = [w for w in results if w["difficulty"].lower() == difficulty.lower()]
    return results

@router.get("/workouts/{workout_id}")
async def get_workout(workout_id: str):
    """Fetch details of a single workout plan."""
    if prisma.is_connected():
        try:
            db_wkt = await prisma.workout.find_unique(
                where={"id": workout_id},
                include={"exercises": True, "trainer": True}
            )
            if db_wkt:
                return db_wkt
        except Exception:
            pass
            
    # Mock fallback
    for w in MOCK_WORKOUTS:
        if w["id"] == workout_id:
            return w
    raise HTTPException(status_code=404, detail="Workout not found")

@router.post("/workouts")
async def create_workout(workout: WorkoutCreate):
    """Submit a custom workout plan."""
    new_id = f"wkt-{uuid.uuid4().hex[:6]}"
    new_wkt = {
        "id": new_id,
        "name": workout.name,
        "description": workout.description,
        "difficulty": workout.difficulty,
        "duration": workout.duration,
        "calories": workout.calories,
        "equipment": workout.equipment,
        "muscleGroups": workout.muscleGroups,
        "trainerId": workout.trainerId or "trn-1",
        "trainerName": "Alex Carter",
        "completionPct": 0,
        "exercises": [
            {
                "id": f"ex-{uuid.uuid4().hex[:6]}",
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
    MOCK_WORKOUTS.append(new_wkt)
    return new_wkt

@router.put("/workouts/{workout_id}")
async def update_workout(workout_id: str, workout: WorkoutCreate):
    """Update details of a custom workout."""
    for idx, w in enumerate(MOCK_WORKOUTS):
        if w["id"] == workout_id:
            updated = w.copy()
            updated.update({
                "name": workout.name,
                "description": workout.description,
                "difficulty": workout.difficulty,
                "duration": workout.duration,
                "calories": workout.calories,
                "equipment": workout.equipment,
                "muscleGroups": workout.muscleGroups,
            })
            MOCK_WORKOUTS[idx] = updated
            return updated
    raise HTTPException(status_code=404, detail="Workout not found")

@router.delete("/workouts/{workout_id}")
async def delete_workout(workout_id: str):
    """Delete a custom workout."""
    global MOCK_WORKOUTS
    initial_len = len(MOCK_WORKOUTS)
    MOCK_WORKOUTS = [w for w in MOCK_WORKOUTS if w["id"] != workout_id]
    if len(MOCK_WORKOUTS) < initial_len:
        return {"success": True, "message": "Workout plan removed"}
    raise HTTPException(status_code=404, detail="Workout not found")

@router.get("/workout-history")
async def get_workout_history():
    """Fetch completed sessions list."""
    return MOCK_HISTORY

@router.post("/workout-session/start")
async def start_session(workout_id: str):
    """Initialize a workout session."""
    return {
        "sessionId": f"sess-{uuid.uuid4().hex[:8]}",
        "workoutId": workout_id,
        "startedAt": datetime.now().isoformat(),
        "status": "active"
    }

@router.post("/workout-session/finish")
async def finish_session(
    workout_id: str,
    duration: int, # in seconds
    calories: int,
    completed_pct: float
):
    """Conclude workout logging and append to records."""
    # Find matching name
    wkt_name = "Push Strength"
    for w in MOCK_WORKOUTS:
        if w["id"] == workout_id:
            wkt_name = w["name"]
            
    new_log = {
        "id": f"hist-{uuid.uuid4().hex[:6]}",
        "workoutName": wkt_name,
        "duration": duration,
        "calories": calories,
        "completedPct": completed_pct,
        "date": datetime.now().isoformat()
    }
    MOCK_HISTORY.insert(0, new_log)
    return {
        "success": True,
        "session": new_log,
        "xpEarned": 150,
        "levelUp": completed_pct >= 100.0
    }
