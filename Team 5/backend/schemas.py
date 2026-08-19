"""
Pydantic schemas for request validation and API response serialization.
"""
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, date
from typing import Optional, List, Dict, Any


# ─── Auth Schemas ────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str = Field(default="Consumer")


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ─── Food Item Schemas ───────────────────────────────────────────────────────

class FoodItemCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    category: str
    purchase_date: date
    quantity: float = Field(default=1.0, gt=0)
    storage_type: str = Field(default="fridge")
    temperature: Optional[float] = Field(default=4.0)
    humidity: Optional[float] = Field(default=90.0)


class FoodItemUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    purchase_date: Optional[date] = None
    quantity: Optional[float] = None
    storage_type: Optional[str] = None
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    status: Optional[str] = None


class FoodItemResponse(BaseModel):
    id: int
    user_id: int
    name: str
    category: str
    purchase_date: date
    quantity: float
    storage_type: str
    temperature: Optional[float]
    humidity: Optional[float]
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ─── Food Image Schemas ─────────────────────────────────────────────────────

class FoodImageResponse(BaseModel):
    id: int
    food_item_id: int
    image_url: str
    uploaded_at: datetime

    model_config = {"from_attributes": True}


# ─── AI Prediction Schemas ───────────────────────────────────────────────────

class AIPredictionResponse(BaseModel):
    id: int
    food_image_id: int
    predicted_class: str
    freshness_label: str
    freshness_score: float
    remaining_shelf_life: float
    spoilage_probability: float
    model_version: str
    predicted_at: datetime
    # --- ADDED THIS LINE ---
    json_data: Optional[str] = None

    model_config = {"from_attributes": True}


class PerFruitResult(BaseModel):
    """Per-fruit classification result from segmentation crop."""
    index: int
    seg_class: str
    seg_confidence: float
    bbox: List[int]
    mask_area: int
    predicted_class: str
    cls_confidence: float
    is_fresh: bool
    top_probs: Dict[str, float] = {}
    crop_image_url: Optional[str] = None


class DefectSpot(BaseModel):
    """Detected rot/spoilage spot."""
    type: str
    label: str
    severity: str
    area_pixels: int
    area_pct: float
    bbox: List[int]


class Recommendation(BaseModel):
    """AI-generated recommendation."""
    type: str  # "info", "warning", "critical"
    title: str
    message: str


class AIPredictionDetailResponse(BaseModel):
    """Extended prediction response with per-fruit breakdown, defect spots, and recommendations."""
    # Core fields (from DB)
    id: int
    food_image_id: int
    predicted_class: str
    freshness_label: str
    freshness_score: float
    remaining_shelf_life: float
    spoilage_probability: float
    model_version: str
    predicted_at: datetime

    # Extended fields (computed, not stored in DB)
    annotated_image: Optional[str] = None
    status: Optional[str] = None
    shelf_life: Optional[str] = None
    rot_percentage: Optional[float] = 0.0
    per_fruit_results: List[PerFruitResult] = []
    num_fruits_detected: int = 0
    fresh_count: int = 0
    spoiled_count: int = 0
    defects: List[DefectSpot] = []
    defect_summary: Optional[str] = None
    defect_image_url: Optional[str] = None
    remaining_hours: float = 0.0
    shelf_life_confidence: str = "medium"
    storage_score: float = 0.0
    overall_health_score: float = 0.0
    days_since_purchase: int = 0
    recommendations: List[Recommendation] = []
    crop_image_urls: List[str] = []
    annotated_image_url: Optional[str] = None
    # --- ADDED THIS LINE ---
    json_data: Optional[str] = None

    model_config = {"from_attributes": True}


class PredictionWithImage(BaseModel):
    prediction: AIPredictionResponse
    image: FoodImageResponse
    food_item: FoodItemResponse

    model_config = {"from_attributes": True}


# ─── Dashboard / Analytics Schemas ───────────────────────────────────────────

class DashboardStats(BaseModel):
    total_items: int
    fresh_count: int
    good_count: int
    acceptable_count: int
    near_spoilage_count: int
    spoiled_count: int
    total_predictions: int
    avg_freshness_score: float


class AdminStats(BaseModel):
    total_users: int
    total_items: int
    total_images: int
    total_predictions: int
    users_by_role: dict