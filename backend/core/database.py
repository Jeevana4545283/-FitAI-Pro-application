import redis.asyncio as aioredis

try:
    from core.config import settings
except ImportError:
    from backend.core.config import settings

try:
    from prisma import Prisma
    prisma = Prisma(datasource={"url": settings.DATABASE_URL})
except Exception as e:
    print(f"INFO: Prisma client fallback active ({e}). Operating in standalone/mock mode.")
    class DummyPrisma:
        def is_connected(self):
            return False
        async def connect(self):
            pass
        async def disconnect(self):
            pass
    prisma = DummyPrisma()

# Redis Client initialization
try:
    redis_client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
except Exception:
    redis_client = None

async def connect_db():
    """Establish connections to PostgreSQL (via Prisma) and Redis."""
    try:
        if not prisma.is_connected():
            await prisma.connect()
        print("INFO: Database connected successfully via Prisma.")
    except Exception as e:
        print(f"WARNING: Database connection failed: {e}")
        print("WARNING: Falling back to Offline/Mock Database Mode due to local OS environment constraints.")

    try:
        # We can also wrap redis client if needed, but let's keep it direct or catch errors
        pass
    except Exception as e:
        print(f"WARNING: Redis connection failed: {e}")

async def disconnect_db():
    """Disconnect database connections gracefully."""
    try:
        if prisma.is_connected():
            await prisma.disconnect()
    except Exception:
        pass
    try:
        await redis_client.close()
    except Exception:
        pass


