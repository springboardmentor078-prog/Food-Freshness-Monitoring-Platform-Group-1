from fastapi import FastAPI
from app.routes.food import router as food_router
from app.routes.auth import router as auth_router

app = FastAPI(title="Food Freshness Monitoring API")

app.include_router(food_router)
app.include_router(auth_router)


@app.get("/")
def root():
    return {
        "message": "Food Freshness Monitoring API is running"
    }