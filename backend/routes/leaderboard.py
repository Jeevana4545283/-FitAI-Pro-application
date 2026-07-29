from fastapi import APIRouter
from typing import List

router = APIRouter(prefix="/api/v1/leaderboard", tags=["leaderboard"])

MOCK_LEADERBOARD = [
    { "rank": 1, "name": "Arjun", "workouts": 32, "score": 2840, "avatar": "A", "me": False },
    { "rank": 2, "name": "You", "workouts": 28, "score": 2610, "avatar": "P", "me": True },
    { "rank": 3, "name": "Sara", "workouts": 25, "score": 2340, "avatar": "S", "me": False },
]

@router.get("")
async def get_leaderboard():
    """Fetch weekly leaderboard user ranks."""
    return MOCK_LEADERBOARD
