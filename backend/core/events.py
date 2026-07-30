from fastapi import FastAPI

try:
    from core.database import connect_db, disconnect_db
    from core.seed import seed_database
except ImportError:
    from backend.core.database import connect_db, disconnect_db
    from backend.core.seed import seed_database

def register_event_handlers(app: FastAPI) -> None:
    """Register startup and shutdown lifecycle hooks for database pooling."""
    @app.on_event("startup")
    async def startup_event():
        await connect_db()
        await seed_database()

    @app.on_event("shutdown")
    async def shutdown_event():
        await disconnect_db()
