from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/v1/coach", tags=["coach"])

# --- Schemas ---
class ChatMessageSubmit(BaseModel):
    message: str

# --- Mock Response Database ---
COACH_RESPONSES = [
    "Your pushing muscles are fully recovered today! That makes it the perfect opportunity to lock in a Push Strength session. Keep the intensity high!",
    "Great work tracking your hydration levels. Staying above 2.5L is key to maintaining high recovery HRV scores. Keep sipping!",
    "I noticed your sleep cycles had slightly elevated latency yesterday. Try reducing screens 45 minutes before bedtime to maximize deep sleep cycles.",
    "Excellent effort on your recent PR! Let's schedule a dedicated active mobility and recovery stretching block before your next heavy lifting session."
]

@router.post("/chat")
async def chat_with_coach(payload: ChatMessageSubmit):
    """Submit a query to the AI Coach and receive recommendations."""
    # Simple simulator picking response based on content keywords
    msg_lower = payload.message.lower()
    resp_text = COACH_RESPONSES[0]
    
    if "water" in msg_lower or "hydrate" in msg_lower:
        resp_text = COACH_RESPONSES[1]
    elif "sleep" in msg_lower or "tired" in msg_lower:
        resp_text = COACH_RESPONSES[2]
    elif "squat" in msg_lower or "bench" in msg_lower or "pr" in msg_lower:
        resp_text = COACH_RESPONSES[3]
        
    return {
        "id": f"msg-{uuid.uuid4().hex[:6]}",
        "sender": "coach",
        "text": resp_text,
        "timestamp": datetime.now().isoformat()
    }
