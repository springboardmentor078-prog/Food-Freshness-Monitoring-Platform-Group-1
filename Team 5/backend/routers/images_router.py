"""
Image upload and retrieval router.
Handles multipart file uploads and stores images locally in uploads/.
"""
import os
import uuid
from typing import List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from database import get_db
from models import User, FoodItem, FoodImage
from schemas import FoodImageResponse
from auth import get_current_user

router = APIRouter(prefix="/api/images", tags=["Food Images"])

# Upload directory — must match main.py's static mount
UPLOAD_DIR = os.path.normpath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "uploads")
)
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload/{food_item_id}", response_model=FoodImageResponse, status_code=201)
async def upload_image(
    food_item_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload a food image for a specific food item."""
    # Verify food item exists and belongs to user
    item = db.query(FoodItem).filter(FoodItem.id == food_item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Food item not found")
    if item.user_id != current_user.id and current_user.role != "Administrator":
        raise HTTPException(status_code=403, detail="Access denied")

    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(allowed_types)}"
        )

    # Save file with unique name
    file_ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    unique_name = f"{uuid.uuid4().hex}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_name)

    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    # Create database record
    image_record = FoodImage(
        food_item_id=food_item_id,
        image_url=unique_name,  # Store just the filename
        uploaded_at=datetime.utcnow()
    )
    db.add(image_record)
    db.commit()
    db.refresh(image_record)

    return image_record


@router.get("/{food_item_id}", response_model=List[FoodImageResponse])
def list_images(
    food_item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all images for a food item."""
    item = db.query(FoodItem).filter(FoodItem.id == food_item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Food item not found")
    if item.user_id != current_user.id and current_user.role != "Administrator":
        raise HTTPException(status_code=403, detail="Access denied")

    images = (
        db.query(FoodImage)
        .filter(FoodImage.food_item_id == food_item_id)
        .order_by(FoodImage.uploaded_at.desc())
        .all()
    )
    return images


@router.get("/file/{filename}")
def serve_image(filename: str):
    """Serve an uploaded image file."""
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Image file not found")
    return FileResponse(file_path)


@router.delete("/{image_id}", status_code=204)
def delete_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a food image and its file."""
    image = db.query(FoodImage).filter(FoodImage.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    # Verify ownership
    item = db.query(FoodItem).filter(FoodItem.id == image.food_item_id).first()
    if item.user_id != current_user.id and current_user.role != "Administrator":
        raise HTTPException(status_code=403, detail="Access denied")

    # Delete file from disk
    file_path = os.path.join(UPLOAD_DIR, image.image_url)
    if os.path.exists(file_path):
        os.remove(file_path)

    db.delete(image)
    db.commit()
