try:
    from core.database import prisma
except ImportError:
    from backend.core.database import prisma

async def seed_database():
    """Seed initial categories, trainers, and sample workouts if database is empty."""
    if not prisma.is_connected():
        return

    try:
        # 1. Seed Categories if empty
        cat_count = await prisma.workoutcategory.count()
        if cat_count == 0:
            categories = [
                {"id": "cat-1", "name": "Strength", "icon": "Dumbbell"},
                {"id": "cat-2", "name": "Push", "icon": "ArrowRight"},
                {"id": "cat-3", "name": "Pull", "icon": "Zap"},
                {"id": "cat-4", "name": "Legs", "icon": "Activity"},
                {"id": "cat-5", "name": "Cardio", "icon": "Flame"},
                {"id": "cat-6", "name": "HIIT", "icon": "Zap"},
                {"id": "cat-7", "name": "Mobility", "icon": "Compass"},
                {"id": "cat-8", "name": "Recovery", "icon": "Heart"},
            ]
            for cat in categories:
                await prisma.workoutcategory.create(data=cat)
            print("INFO: Seeded Workout Categories.")

        # 2. Seed Trainers if empty
        trainer_count = await prisma.trainer.count()
        if trainer_count == 0:
            trainers = [
                {"id": "trn-1", "name": "Alex Carter", "avatar": "A"},
                {"id": "trn-2", "name": "Sarah Jenkins", "avatar": "S"},
            ]
            for trn in trainers:
                await prisma.trainer.create(data=trn)
            print("INFO: Seeded Trainers.")

        # 3. Seed Sample Workouts if empty
        workout_count = await prisma.workout.count()
        if workout_count == 0:
            # Strength Category & Alex Carter
            cat_strength = await prisma.workoutcategory.find_first(where={"name": "Strength"})
            trn_alex = await prisma.trainer.find_first(where={"name": "Alex Carter"})
            trn_sarah = await prisma.trainer.find_first(where={"name": "Sarah Jenkins"})

            wkt1 = await prisma.workout.create(
                data={
                    "id": "wkt-1",
                    "name": "Push Strength",
                    "description": "Elite upper body pushing hypertrophy session targeting chest, shoulders, and triceps.",
                    "difficulty": "Intermediate",
                    "duration": 45,
                    "calories": 420,
                    "equipment": ["Dumbbells", "Barbell"],
                    "muscleGroups": ["Chest", "Shoulders", "Triceps"],
                    "trainerId": trn_alex.id if trn_alex else None,
                    "categoryId": cat_strength.id if cat_strength else None,
                    "exercises": {
                        "create": [
                            {"id": "ex-1", "name": "Barbell Bench Press", "sets": 4, "reps": "8-10", "weight": 80.0, "restTime": 60, "videoUrl": "", "coachTips": "Keep shoulder blades retracted and drive from heels.", "targetMuscle": "Chest", "order": 1},
                            {"id": "ex-2", "name": "Incline Dumbbell Press", "sets": 3, "reps": "10-12", "weight": 32.0, "restTime": 60, "videoUrl": "", "coachTips": "Control the negative phase down to upper chest.", "targetMuscle": "Chest", "order": 2},
                            {"id": "ex-3", "name": "Cable Fly", "sets": 3, "reps": "12-15", "weight": 15.0, "restTime": 45, "videoUrl": "", "coachTips": "Squeeze at peak contraction and avoid using momentum.", "targetMuscle": "Chest", "order": 3},
                            {"id": "ex-4", "name": "Rope Tricep Pushdown", "sets": 3, "reps": "12-15", "weight": 22.0, "restTime": 45, "videoUrl": "", "coachTips": "Keep elbows locked by your ribs and flare rope at bottom.", "targetMuscle": "Triceps", "order": 4},
                        ]
                    }
                }
            )

            wkt2 = await prisma.workout.create(
                data={
                    "id": "wkt-2",
                    "name": "Leg Hypertrophy",
                    "description": "Posterior chain focus for maximal growth.",
                    "difficulty": "Advanced",
                    "duration": 60,
                    "calories": 520,
                    "equipment": ["Barbell", "Machines"],
                    "muscleGroups": ["Quads", "Hamstrings", "Glutes"],
                    "trainerId": trn_sarah.id if trn_sarah else None,
                    "categoryId": cat_strength.id if cat_strength else None,
                    "exercises": {
                        "create": [
                            {"id": "ex-5", "name": "Barbell Squats", "sets": 4, "reps": "6-8", "weight": 100.0, "restTime": 90, "videoUrl": "", "coachTips": "Squat to parallel or lower; drive upwards with hips.", "targetMuscle": "Quads", "order": 1},
                            {"id": "ex-6", "name": "Romanian Deadlifts", "sets": 3, "reps": "10-12", "weight": 70.0, "restTime": 75, "videoUrl": "", "coachTips": "Hinge at hips, keep back neutral, feel stretch in hamstrings.", "targetMuscle": "Hamstrings", "order": 2},
                        ]
                    }
                }
            )
            print("INFO: Seeded Sample Workouts.")
    except Exception as e:
        print(f"WARNING: Database seeding skipped or failed: {e}")
