from fastapi import APIRouter, HTTPException, UploadFile, File, status
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/v1/recovery", tags=["recovery"])

# --- Schemas ---
class ReportResponse(BaseModel):
    id: str
    name: str
    date: str
    summaryStatus: str
    type: str
    doctorName: Optional[str] = None

# --- Mock Data Database ---
MOCK_RECOVERY = {
    "score": 89,
    "status": "Ready to Train",
    "description": "Your body is recovered and primed for performance.",
    "sleep": "7h 45m",
    "sleepStatus": "Good",
    "sleepHistory": [40, 70, 55, 85, 60, 75],
    "heartRate": 62,
    "hrStatus": "Resting",
    "hydration": 2.4,
    "hydrationPct": 80,
    "stressScore": 42,
    "stressStatus": "Moderate"
}

MOCK_TIMELINE = [
    { "day": "Today", "score": 89, "color": "var(--green)", "icon": "check" },
    { "day": "Tomorrow", "score": 85, "color": "var(--blue)", "icon": "star" },
    { "day": "2 Days", "score": 70, "color": "var(--blue)", "icon": "star" },
    { "day": "Full Recovery", "score": 100, "color": "var(--purple)", "icon": "star" }
]

MOCK_BODY_STATUS = {
    "chest": "var(--green)",
    "shoulders": "var(--green)",
    "back": "var(--green)",
    "arms": "var(--amber)",
    "quads": "var(--red)",
    "hamstrings": "var(--amber)"
}

MOCK_ADVICE = [
    { "id": "1", "title": "Light Stretching", "duration": "10 min", "priority": "High" },
    { "id": "2", "title": "Foam Rolling", "duration": "8 min", "priority": "Medium" },
    { "id": "3", "title": "Increase Protein", "duration": "120–150g", "priority": "High" },
    { "id": "4", "title": "Sleep Early", "duration": "7–8 hrs", "priority": "Medium" }
]

MOCK_REPORTS = [
    {
        "id": "rep-1",
        "name": "Blood Report",
        "date": "May 18, 2026",
        "summaryStatus": "AI Summary Ready",
        "type": "General Health",
        "doctorName": "Dr. Henderson"
    }
]

# --- Endpoints ---

@router.get("")
async def get_recovery_status():
    """Retrieve overall recovery score indices."""
    return MOCK_RECOVERY

@router.get("/timeline")
async def get_recovery_timeline():
    """Retrieve recovery score timeline projections."""
    return MOCK_TIMELINE

@router.get("/body-status")
async def get_body_status():
    """Retrieve muscle groups fatigue status colors."""
    return MOCK_BODY_STATUS

@router.get("/advice")
async def get_recovery_advice():
    """Retrieve AI coaching recovery recommendations."""
    return MOCK_ADVICE

@router.get("/reports", response_model=List[ReportResponse])
async def get_medical_reports():
    """Fetch uploaded medical reports list."""
    return MOCK_REPORTS

@router.post("/reports/upload", response_model=ReportResponse)
async def upload_medical_report(name: str):
    """Mimic medical report file uploading."""
    new_report = {
        "id": f"rep-{uuid.uuid4().hex[:6]}",
        "name": name,
        "date": datetime.now().strftime("%b %d, %Y"),
        "summaryStatus": "AI Summary Ready",
        "type": "Uploaded PDF",
        "doctorName": "AI Assistant"
      }
    MOCK_REPORTS.insert(0, new_report)
    return new_report

@router.delete("/reports/{report_id}")
async def delete_medical_report(report_id: str):
    """Delete a medical report record."""
    global MOCK_REPORTS
    initial_len = len(MOCK_REPORTS)
    MOCK_REPORTS = [r for r in MOCK_REPORTS if r["id"] != report_id]
    if len(MOCK_REPORTS) < initial_len:
        return { "success": True, "message": "Medical report deleted" }
    raise HTTPException(status_code=404, detail="Medical report not found")
