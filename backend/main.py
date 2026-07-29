from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from secure import Secure

try:
    from core.config import settings
    from core.events import register_event_handlers
    from core.exceptions import register_exception_handlers
    from routes.workouts import router as workouts_router
    from routes.profile import router as profile_router
    from routes.nutrition import router as nutrition_router
    from routes.coach import router as coach_router
    from routes.leaderboard import router as leaderboard_router
    from routes.recovery import router as recovery_router
except ImportError:
    from backend.core.config import settings
    from backend.core.events import register_event_handlers
    from backend.core.exceptions import register_exception_handlers
    from backend.routes.workouts import router as workouts_router
    from backend.routes.profile import router as profile_router
    from backend.routes.nutrition import router as nutrition_router
    from backend.routes.coach import router as coach_router
    from backend.routes.leaderboard import router as leaderboard_router
    from backend.routes.recovery import router as recovery_router

app = FastAPI(
    title="FitAIX API",
    description="World-class AI-powered Fitness Application API",
    version=settings.API_VERSION,
    docs_url=f"/api/{settings.API_VERSION}/docs",
    openapi_url=f"/api/{settings.API_VERSION}/openapi.json",
)

# CORS middleware config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gzip response compression middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Secure headers (Helmet equivalent in Python)
@app.middleware("http")
async def set_secure_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "no-referrer"
    return response

# Bind lifecycle hooks and exception converters
register_event_handlers(app)
register_exception_handlers(app)

# Include routers
app.include_router(workouts_router)
app.include_router(profile_router)
app.include_router(nutrition_router)
app.include_router(coach_router)
app.include_router(leaderboard_router)
app.include_router(recovery_router)

@app.get("/")
async def root():
    return {
        "status": "healthy",
        "app": "FitAIX Platform API",
        "version": settings.API_VERSION,
        "env": settings.APP_ENV
    }
