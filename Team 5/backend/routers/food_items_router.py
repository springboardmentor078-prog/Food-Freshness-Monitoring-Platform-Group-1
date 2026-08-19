"""
Food inventory management router: CRUD operations for food items.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime

from database import get_db
from models import User, FoodItem, AIPrediction, FoodImage
from schemas import (
    FoodItemCreate, FoodItemUpdate, FoodItemResponse,
    DashboardStats, AdminStats
)
from auth import get_current_user, require_roles

router = APIRouter(prefix="/api/food-items", tags=["Food Items"])


# ─── Dashboard Stats (MUST be before /{item_id} to avoid route conflict) ────


@router.get("/dashboard-stats", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get dashboard statistics for the current user's inventory."""
    if current_user.role == "Administrator":
        base_query = db.query(FoodItem)
    else:
        base_query = db.query(FoodItem).filter(
            FoodItem.user_id == current_user.id
        )

    items = base_query.all()
    total_items = len(items)

    # Count by status
    status_counts = {
        "Fresh": 0, "Good": 0, "Acceptable": 0,
        "Near Spoilage": 0, "Spoiled": 0
    }
    for item in items:
        if item.status in status_counts:
            status_counts[item.status] += 1

    # Count total predictions and average freshness score
    if current_user.role == "Administrator":
        predictions = db.query(AIPrediction).all()
    else:
        predictions = (
            db.query(AIPrediction)
            .join(FoodImage)
            .join(FoodItem)
            .filter(FoodItem.user_id == current_user.id)
            .all()
        )

    total_predictions = len(predictions)
    avg_score = 0.0
    if total_predictions > 0:
        avg_score = round(
            sum(p.freshness_score for p in predictions) / total_predictions, 1
        )

    return DashboardStats(
        total_items=total_items,
        fresh_count=status_counts["Fresh"],
        good_count=status_counts["Good"],
        acceptable_count=status_counts["Acceptable"],
        near_spoilage_count=status_counts["Near Spoilage"],
        spoiled_count=status_counts["Spoiled"],
        total_predictions=total_predictions,
        avg_freshness_score=avg_score
    )


@router.get("/admin-stats", response_model=AdminStats)
def get_admin_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("Administrator")
    )
):
    """Get platform-wide statistics (Admin only)."""
    from models import User as UserModel
    total_users = db.query(UserModel).count()
    total_items = db.query(FoodItem).count()
    total_images = db.query(FoodImage).count()
    total_predictions = db.query(AIPrediction).count()

    # Users by role
    role_counts = (
        db.query(UserModel.role, func.count(UserModel.id))
        .group_by(UserModel.role)
        .all()
    )
    users_by_role = {role: count for role, count in role_counts}

    return AdminStats(
        total_users=total_users,
        total_items=total_items,
        total_images=total_images,
        total_predictions=total_predictions,
        users_by_role=users_by_role
    )


# ─── CRUD Operations ────────────────────────────────────────────────────────


@router.post("/", response_model=FoodItemResponse, status_code=201)
@router.post("", response_model=FoodItemResponse, status_code=201)
def create_food_item(
    item_data: FoodItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a new food item to the user's inventory."""
    new_item = FoodItem(
        user_id=current_user.id,
        name=item_data.name,
        category=item_data.category,
        purchase_date=item_data.purchase_date,
        quantity=item_data.quantity,
        storage_type=item_data.storage_type,
        temperature=item_data.temperature,
        humidity=item_data.humidity,
        status="Fresh"
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item


@router.get("/", response_model=List[FoodItemResponse])
@router.get("", response_model=List[FoodItemResponse])
def list_food_items(
    category: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List food items. Admins see all; others see only their own."""
    if current_user.role == "Administrator":
        query = db.query(FoodItem)
    else:
        query = db.query(FoodItem).filter(FoodItem.user_id == current_user.id)

    if category:
        query = query.filter(FoodItem.category == category)
    if status_filter:
        query = query.filter(FoodItem.status == status_filter)

    return query.order_by(FoodItem.created_at.desc()).all()


@router.get("/{item_id}", response_model=FoodItemResponse)
def get_food_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a single food item by ID."""
    item = db.query(FoodItem).filter(FoodItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Food item not found")

    # Only owner or admin can view
    if item.user_id != current_user.id and current_user.role != "Administrator":
        raise HTTPException(status_code=403, detail="Access denied")

    return item


@router.put("/{item_id}", response_model=FoodItemResponse)
def update_food_item(
    item_id: int,
    update_data: FoodItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a food item."""
    item = db.query(FoodItem).filter(FoodItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Food item not found")

    if item.user_id != current_user.id and current_user.role != "Administrator":
        raise HTTPException(status_code=403, detail="Access denied")

    # Apply updates for non-None fields
    update_dict = update_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(item, key, value)

    item.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=204)
def delete_food_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a food item and its associated images/predictions."""
    item = db.query(FoodItem).filter(FoodItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Food item not found")

    if item.user_id != current_user.id and current_user.role != "Administrator":
        raise HTTPException(status_code=403, detail="Access denied")

    db.delete(item)
    db.commit()
