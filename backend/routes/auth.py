from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional

try:
    from core.database import prisma
except ImportError:
    from backend.core.database import prisma

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

class UserRegister(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    userId: str
    name: str
    email: str
    isProfileComplete: bool = False

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register_user(payload: UserRegister):
    """Register a new user directly in PostgreSQL."""
    email_clean = payload.email.strip().lower()

    if prisma.is_connected():
        # Check if email exists
        existing_user = await prisma.user.find_unique(where={"email": email_clean})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists."
            )

        new_user = await prisma.user.create(
            data={
                "name": payload.name.strip(),
                "email": email_clean,
                "password": payload.password, # Direct password storage
            }
        )
        return AuthResponse(
            userId=new_user.id,
            name=new_user.name or payload.name,
            email=new_user.email,
            isProfileComplete=False
        )
    
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Database not connected."
    )

@router.post("/login", response_model=AuthResponse)
async def login_user(payload: UserLogin):
    """Login user by matching email and password against PostgreSQL."""
    email_clean = payload.email.strip().lower()

    if prisma.is_connected():
        user = await prisma.user.find_unique(where={"email": email_clean})
        if user and user.password == payload.password:
            # Profile is complete if key attributes (height, weight, fitnessGoal) are filled
            is_complete = bool(user.height and user.weight and user.fitnessGoal)
            return AuthResponse(
                userId=user.id,
                name=user.name or "User",
                email=user.email,
                isProfileComplete=is_complete
            )
        
        # Invalid credentials return 401
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Database not connected."
    )
