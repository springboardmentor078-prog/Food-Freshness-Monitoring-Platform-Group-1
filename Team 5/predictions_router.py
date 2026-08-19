"""
AI prediction router: triggers model inference pipeline and stores results.
"""
import os
import json  # <--- ADDED THIS IMPORT
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from models import User, FoodItem, FoodImage, AIPrediction
from schemas import (
    AIPredictionResponse, AIPredictionDetailResponse,
    PredictionWithImage, FoodImageResponse, FoodItemResponse,
    PerFruitResult, Recommendation, DefectSpot
)
from auth import get_current_user

router = APIRouter(prefix="/api/predict", tags=["AI Predictions"])

# Upload directory path (same as images_router)
UPLOAD_DIR = os.path.normpath(
    os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "..", "uploads"
    )
)

# ─── Prediction Routes ───────────────────────────────────────────────────

@router.post("/{food_image_id}", response_model=AIPredictionDetailResponse, status_code=201)
def run_prediction(
    food_image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Run the full AI pipeline on a food image:
    1. YOLOv8 segmentation → isolate fruit regions
    2. YOLOv8 classification → classify each region
    3. OpenCV Defect Detection → detect rotten spots, mold, bruising
    4. Scoring engine → aggregate freshness_score, freshness_label, spoilage_probability
    5. LightGBM shelf-life → remaining_shelf_life
    6. Generate recommendations
    7. Store result in ai_predictions table
    """
    # Fetch image record
    image = db.query(FoodImage).filter(FoodImage.id == food_image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    # Fetch food item for storage conditions
    food_item = (
        db.query(FoodItem)
        .filter(FoodItem.id == image.food_item_id)
        .first()
    )
    if not food_item:
        raise HTTPException(status_code=404, detail="Food item not found")

    # Check ownership
    if food_item.user_id != current_user.id and current_user.role != "Administrator":
        raise HTTPException(status_code=403, detail="Access denied")

    # Resolve image path
    image_path = os.path.normpath(os.path.join(UPLOAD_DIR, image.image_url))
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image file not found on disk")

    # Import and run AI pipeline
    try:
        from services.ai_service import AIService
        ai = AIService()
        result = ai.analyze(
            image_path=image_path,
            produce_type=food_item.name,
            temperature_c=food_item.temperature or 4.0,
            humidity_pct=food_item.humidity or 90.0,
            storage_area=food_item.storage_type or "fridge",
            packaging_material="unpackaged",
            purchase_date=food_item.purchase_date,
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {str(e)}"
        )

    # Store prediction in database
    prediction = AIPrediction(
        food_image_id=food_image_id,
        predicted_class=result["predicted_class"],
        freshness_label=result["freshness_label"],
        freshness_score=result["freshness_score"],
        remaining_shelf_life=result["remaining_shelf_life"],
        spoilage_probability=result["spoilage_probability"],
        model_version=result["model_version"],
        # --- CRITICAL FIX: Save the full JSON payload into the database ---
        json_data=json.dumps(result)
    )
    db.add(prediction)

    # Update food item status based on freshness label
    food_item.status = result["freshness_label"]
    db.commit()
    db.refresh(prediction)

    # Build the extended response
    extra = result.get("extra", {})

    return AIPredictionDetailResponse(
        id=prediction.id,
        food_image_id=prediction.food_image_id,
        predicted_class=prediction.predicted_class,
        freshness_label=prediction.freshness_label,
        freshness_score=prediction.freshness_score,
        remaining_shelf_life=prediction.remaining_shelf_life,
        spoilage_probability=prediction.spoilage_probability,
        model_version=prediction.model_version,
        predicted_at=prediction.predicted_at,
        # Extended fields
        annotated_image=result.get("annotated_image") or extra.get("annotated_image"),
        status=result.get("status") or extra.get("status"),
        shelf_life=result.get("shelf_life") or extra.get("shelf_life"),
        rot_percentage=result.get("rot_percentage", extra.get("rot_percentage", 0.0)),
        per_fruit_results=[
            PerFruitResult(**fr) for fr in extra.get("per_fruit_results", [])
        ],
        num_fruits_detected=extra.get("num_fruits_detected", 0),
        fresh_count=extra.get("fresh_count", 0),
        spoiled_count=extra.get("spoiled_count", 0),
        defects=[
            DefectSpot(**d) for d in extra.get("defects", [])
        ],
        defect_summary=extra.get("defect_summary"),
        defect_image_url=extra.get("defect_image_url"),
        remaining_hours=extra.get("remaining_hours", 0.0),
        shelf_life_confidence=extra.get("shelf_life_confidence", "medium"),
        storage_score=extra.get("storage_score", 0.0),
        overall_health_score=extra.get("overall_health_score", 0.0),
        days_since_purchase=extra.get("days_since_purchase", 0),
        recommendations=[
            Recommendation(**r) for r in extra.get("recommendations", [])
        ],
        crop_image_urls=extra.get("crop_image_urls", []),
        annotated_image_url=extra.get("annotated_image_url"),
        chatbot_advice=extra.get("chatbot_advice", [])
    )


@router.get("/{food_image_id}", response_model=List[AIPredictionResponse])
def get_predictions_for_image(
    food_image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all predictions for a specific image."""
    predictions = (
        db.query(AIPrediction)
        .filter(AIPrediction.food_image_id == food_image_id)
        .order_by(AIPrediction.predicted_at.desc())
        .all()
    )
    return predictions


@router.get("/item/{food_item_id}", response_model=List[PredictionWithImage])
def get_predictions_for_item(
    food_item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all predictions for all images of a food item."""
    food_item = db.query(FoodItem).filter(FoodItem.id == food_item_id).first()
    if not food_item:
        raise HTTPException(status_code=404, detail="Food item not found")
    if food_item.user_id != current_user.id and current_user.role != "Administrator":
        raise HTTPException(status_code=403, detail="Access denied")

    results = []
    images = (
        db.query(FoodImage)
        .filter(FoodImage.food_item_id == food_item_id)
        .all()
    )

    for img in images:
        preds = (
            db.query(AIPrediction)
            .filter(AIPrediction.food_image_id == img.id)
            .order_by(AIPrediction.predicted_at.desc())
            .all()
        )
        for pred in preds:
            results.append(PredictionWithImage(
                prediction=AIPredictionResponse.model_validate(pred),
                image=FoodImageResponse.model_validate(img),
                food_item=FoodItemResponse.model_validate(food_item)
            ))

    return results


@router.get("/latest/{food_item_id}", response_model=AIPredictionDetailResponse)
def get_latest_prediction(
    food_item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get the most recent prediction for a food item."""
    food_item = db.query(FoodItem).filter(FoodItem.id == food_item_id).first()
    if not food_item:
        raise HTTPException(status_code=404, detail="Food item not found")

    latest = (
        db.query(AIPrediction)
        .join(FoodImage)
        .filter(FoodImage.food_item_id == food_item_id)
        .order_by(AIPrediction.predicted_at.desc())
        .first()
    )

    if not latest:
        raise HTTPException(
            status_code=404,
            detail="No predictions found for this item"
        )

    # --- UPDATED: If we stored json_data, decode it to recreate the exact result ---
    if latest.json_data:
        full_result = json.loads(latest.json_data)
        extra = full_result.get("extra", {})
        return AIPredictionDetailResponse(
            id=latest.id,
            food_image_id=latest.food_image_id,
            predicted_class=latest.predicted_class,
            freshness_label=latest.freshness_label,
            freshness_score=latest.freshness_score,
            remaining_shelf_life=latest.remaining_shelf_life,
            spoilage_probability=latest.spoilage_probability,
            model_version=latest.model_version,
            predicted_at=latest.predicted_at,
            annotated_image=full_result.get("annotated_image") or extra.get("annotated_image"),
            status=full_result.get("status") or extra.get("status"),
            shelf_life=full_result.get("shelf_life") or extra.get("shelf_life"),
            rot_percentage=full_result.get("rot_percentage", extra.get("rot_percentage", 0.0)),
            per_fruit_results=[
                PerFruitResult(**fr) for fr in extra.get("per_fruit_results", [])
            ],
            num_fruits_detected=extra.get("num_fruits_detected", 0),
            fresh_count=extra.get("fresh_count", 0),
            spoiled_count=extra.get("spoiled_count", 0),
            defects=[
                DefectSpot(**d) for d in extra.get("defects", [])
            ],
            defect_summary=extra.get("defect_summary"),
            defect_image_url=extra.get("defect_image_url"),
            remaining_hours=extra.get("remaining_hours", 0.0),
            shelf_life_confidence=extra.get("shelf_life_confidence", "medium"),
            storage_score=extra.get("storage_score", 0.0),
            overall_health_score=extra.get("overall_health_score", 0.0),
            days_since_purchase=extra.get("days_since_purchase", 0),
            recommendations=[
                Recommendation(**r) for r in extra.get("recommendations", [])
            ],
            crop_image_urls=extra.get("crop_image_urls", []),
            annotated_image_url=extra.get("annotated_image_url"),
        )

    # Fallback if no JSON was stored (safety net)
    image = db.query(FoodImage).filter(FoodImage.id == latest.food_image_id).first()
    annotated_image_url = image.image_url if image else None

    extra = {
        "annotated_image": f"/uploads/{annotated_image_url}" if annotated_image_url else None,
        "status": latest.freshness_label,
        "shelf_life": f"{latest.remaining_shelf_life} Days",
        "rot_percentage": getattr(latest, 'rot_percentage', 0.0),
        "num_fruits_detected": 1,
        "recommendations": [],
    }

    return AIPredictionDetailResponse(
        id=latest.id,
        food_image_id=latest.food_image_id,
        predicted_class=latest.predicted_class,
        freshness_label=latest.freshness_label,
        freshness_score=latest.freshness_score,
        remaining_shelf_life=latest.remaining_shelf_life,
        spoilage_probability=latest.spoilage_probability,
        model_version=latest.model_version,
        predicted_at=latest.predicted_at,
        annotated_image=extra.get("annotated_image"),
        status=extra.get("status"),
        shelf_life=extra.get("shelf_life"),
        rot_percentage=extra.get("rot_percentage"),
        per_fruit_results=[],
        num_fruits_detected=extra.get("num_fruits_detected", 0),
        fresh_count=0,
        spoiled_count=0,
        defects=[],
        defect_summary="",
        defect_image_url=None,
        remaining_hours=latest.remaining_shelf_life * 24,
        shelf_life_confidence="medium",
        storage_score=0.0,
        overall_health_score=latest.freshness_score,
        days_since_purchase=0,
        recommendations=[],
        crop_image_urls=[],
        annotated_image_url=extra.get("annotated_image"),
    )