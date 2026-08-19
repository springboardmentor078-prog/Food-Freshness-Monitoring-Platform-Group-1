from contextlib import asynccontextmanager
from pathlib import Path
from typing import Optional

import uvicorn

from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Form,
    HTTPException,
)

from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from ai import (
    MODELS,
    run_pipeline,
    decode_image_bytes,
)


# PATHS

PROJECT_ROOT = Path(__file__).resolve().parent

OUTPUT_DIR = (PROJECT_ROOT / "outputs")

OUTPUT_DIR.mkdir( parents=True,exist_ok=True,)


# APPLICATION LIFESPAN
@asynccontextmanager
async def lifespan(app: FastAPI):

    print()
    print("=" * 70)
    print("STARTING FOOD FRESHNESS AI ENGINE")
    print("=" * 70)

    try:

        print(
            "Loading AI models..."
        )

        MODELS.load_all()

        print()
        print(
            "Classification model:",
            MODELS.classification_model
            is not None,
        )

        print(
            "Segmentation model:",
            MODELS.segmentation_model
            is not None,
        )

        print(
            "Shelf-life model:",
            MODELS.shelf_life_model
            is not None,
        )

        print(
            "Shelf-life feature columns:",
            MODELS.shelf_life_feature_columns
            is not None,
        )

        print()
        print(
            "AI MODELS LOADED SUCCESSFULLY"
        )

        print("=" * 70)
        print()

    except Exception as e:

        print()
        print("=" * 70)
        print("ERROR LOADING AI MODELS")
        print("=" * 70)
        print(
            str(e)
        )
        print("=" * 70)

        raise

    yield

    print()
    print("=" * 70)
    print(
        "SHUTTING DOWN FOOD FRESHNESS AI ENGINE"
    )
    print("=" * 70)


# FASTAPI APPLICATION
app = FastAPI(

    title=(
        "Food Freshness Monitoring Platform "
        "- AI Engine"
    ),

    description=(
        "AI-powered food freshness analysis, "
        "spoilage detection and remaining "
        "shelf-life prediction API."
    ),

    version="1.0.0",

    lifespan=lifespan,
)

app.mount(
    "/images",
    StaticFiles(
        directory=str(
            OUTPUT_DIR
        )
    ),
    name="images",
)

app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

@app.get("/")
def root():

    return {

        "message": (
            "Food Freshness Monitoring "
            "AI Engine is running."
        ),

        "version": "1.0.0",

        "endpoints": {

            "health": "/health",

            "analyze": "/analyze",

            "documentation": "/docs",

        },
    }



@app.get("/health")
def health_check():
    return {

        "status": "online",

        "models_loaded": {

            "classification": (
                MODELS.classification_model
                is not None
            ),

            "segmentation": (
                MODELS.segmentation_model
                is not None
            ),

            "shelf_life": (
                MODELS.shelf_life_model
                is not None
            ),
        },
    }


@app.post("/analyze")
async def analyze_freshness(

    file: UploadFile = File(
        ...,
        description="Food image file",
    ),

    temperature_c: Optional[float] = Form(
        25.0,
        description=(
            "Storage temperature in °C"
        ),
    ),

    humidity_percent: Optional[float] = Form(
        60.0,
        description=(
            "Relative humidity percentage"
        ),
    ),

    storage_area: Optional[str] = Form(
        "Room Temperature",
        description=(
            "Storage area, e.g. "
            "Fridge, Pantry, Room Temperature"
        ),
    ),

    packaging_type: Optional[str] = Form(
        "Loose",
        description=(
            "Packaging type, e.g. "
            "Loose, Plastic Wrap, Sealed Bag"
        ),
    ),

    storage_duration_days: Optional[float] = Form(
        0.0,
        description=(
            "Number of days the food "
            "has already been stored"
        ),
    ),
):

    if not file.content_type:

        raise HTTPException(
            status_code=400,
            detail=(
                "Could not determine "
                "uploaded file type."
            ),
        )

    if not file.content_type.startswith(
        "image/"
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "Uploaded file must "
                "be an image."
            ),
        )

    if temperature_c is None:
        temperature_c = 25.0

    if humidity_percent is None:
        humidity_percent = 60.0

    if storage_area is None:
        storage_area = "Room Temperature"

    if packaging_type is None:
        packaging_type = "Loose"

    if storage_duration_days is None:
        storage_duration_days = 0.0

    if humidity_percent < 0:

        raise HTTPException(
            status_code=400,
            detail=(
                "Humidity cannot be "
                "less than 0%."
            ),
        )

    if humidity_percent > 100:

        raise HTTPException(
            status_code=400,
            detail=(
                "Humidity cannot be "
                "greater than 100%."
            ),
        )

    if storage_duration_days < 0:

        raise HTTPException(
            status_code=400,
            detail=(
                "Storage duration "
                "cannot be negative."
            ),
        )
    try:

        contents = await file.read()

        if not contents:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Uploaded image "
                    "is empty."
                ),
            )

        image = decode_image_bytes(
            contents
        )

    except HTTPException:

        raise

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=(
                "Unable to decode "
                f"uploaded image: {str(e)}"
            ),
        )

    storage_conditions = {

        "temperature_c": (
            temperature_c
        ),

        "humidity_percent": (
            humidity_percent
        ),

        "storage_area": (
            storage_area
        ),

        "packaging_type": (
            packaging_type
        ),

        "storage_duration_days": (
            storage_duration_days
        ),
    }

    try:

        results = run_pipeline(

            image=image,

            storage_conditions=(
                storage_conditions
            ),
        )

        return results

    except Exception as e:

        print()
        print(
            "[API] Pipeline execution failed:"
        )

        print(
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Pipeline execution error: "
                f"{str(e)}"
            ),
        )
if __name__ == "__main__":

    uvicorn.run(

        "main:app",

        host="0.0.0.0",

        port=8000,

        reload=True,
    )
