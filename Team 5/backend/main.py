"""
Food Freshness Monitoring Platform — FastAPI Application Entry Point.

Run with: uvicorn main:app --reload --port 8000
"""
import os
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import engine, Base
from routers import auth_router, food_items_router, images_router, predictions_router

# ─── Logging Setup ───────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s │ %(name)s │ %(levelname)s │ %(message)s"
)
logger = logging.getLogger(__name__)


# ─── Lifespan (replaces deprecated @app.on_event) ───────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create database tables on startup."""
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables ready.")
    logger.info("Food Freshness Monitoring Platform is running!")
    logger.info("API docs available at: http://localhost:8000/docs")
    yield
    logger.info("Shutting down Food Freshness Platform.")


# ─── FastAPI App ─────────────────────────────────────────────────────────────

app = FastAPI(
    title="Food Freshness Monitoring Platform",
    description=(
        "AI-powered platform for food freshness assessment, "
        "shelf-life prediction, and storage optimization."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
    redirect_slashes=False,
)

# ─── CORS ────────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "http://localhost:3000",   # Alternative React port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Static File Serving (uploaded images) ───────────────────────────────────

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# ─── Routers ─────────────────────────────────────────────────────────────────

app.include_router(auth_router.router)
app.include_router(food_items_router.router)
app.include_router(images_router.router)
app.include_router(predictions_router.router)


# ─── Root Endpoint ───────────────────────────────────────────────────────────


@app.get("/", tags=["Health"])
def root():
    return {
        "platform": "Food Freshness Monitoring Platform",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs",
        "endpoints": {
            "auth": "/api/auth",
            "food_items": "/api/food-items",
            "images": "/api/images",
            "predictions": "/api/predict"
        }
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}
