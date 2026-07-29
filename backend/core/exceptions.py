from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse

class FitAIXException(Exception):
    """Base exception for all FitAIX core errors."""
    def __init__(self, message: str, status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR):
        self.message = message
        self.status_code = status_code
        super().__init__(message)

class NotFoundException(FitAIXException):
    """Resource not found."""
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, status.HTTP_404_NOT_FOUND)

class UnauthorizedException(FitAIXException):
    """Unauthorized access."""
    def __init__(self, message: str = "Unauthorized access"):
        super().__init__(message, status.HTTP_401_UNAUTHORIZED)

class DatabaseConnectionException(FitAIXException):
    """Database connection failed."""
    def __init__(self, message: str = "Database connection error"):
        super().__init__(message, status.HTTP_503_SERVICE_UNAVAILABLE)

def register_exception_handlers(app: FastAPI) -> None:
    """Bind global handlers for custom application exceptions."""
    @app.exception_handler(FitAIXException)
    async def fitaix_exception_handler(request: Request, exc: FitAIXException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"success": False, "error": exc.message},
        )
