"""
SQLAlchemy ORM models matching the mentor-specified database schema.

Tables:
  users → food_items → food_images → ai_predictions
"""
from datetime import datetime, date
from sqlalchemy import (
    Column, Integer, String, Float, DateTime, Date,
    ForeignKey, Text, CheckConstraint
)
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    """User accounts with role-based access control."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="Consumer")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    food_items = relationship(
        "FoodItem", back_populates="owner",
        cascade="all, delete-orphan"
    )

    __table_args__ = (
        CheckConstraint(
            "role IN ('Consumer', 'Retail Manager', 'Warehouse Operator', "
            "'Food Quality Inspector', 'Administrator')",
            name="valid_role"
        ),
    )


class FoodItem(Base):
    """Food inventory items linked to a user."""
    __tablename__ = "food_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    purchase_date = Column(Date, nullable=False, default=date.today)
    quantity = Column(Float, nullable=False, default=1.0)
    storage_type = Column(String(100), nullable=False, default="fridge")
    temperature = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    status = Column(String(50), nullable=False, default="Fresh")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    owner = relationship("User", back_populates="food_items")
    images = relationship(
        "FoodImage", back_populates="food_item",
        cascade="all, delete-orphan"
    )

    __table_args__ = (
        CheckConstraint(
            "category IN ('Fruits', 'Vegetables', 'Dairy Products', "
            "'Meat & Poultry', 'Seafood', 'Bakery Products', "
            "'Packaged Foods', 'Beverages')",
            name="valid_category"
        ),
        CheckConstraint(
            "storage_type IN ('fridge', 'counter', 'pantry', 'cold_room')",
            name="valid_storage_type"
        ),
        # --- FIXED: Added 'Rotten' to this list ---
        CheckConstraint(
            "status IN ('Fresh', 'Good', 'Acceptable', "
            "'Near Spoilage', 'Spoiled', 'Rotten')",
            name="valid_status"
        ),
    )


class FoodImage(Base):
    """Uploaded food images linked to a food item."""
    __tablename__ = "food_images"

    id = Column(Integer, primary_key=True, index=True)
    food_item_id = Column(
        Integer, ForeignKey("food_items.id", ondelete="CASCADE"),
        nullable=False
    )
    image_url = Column(Text, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    food_item = relationship("FoodItem", back_populates="images")
    predictions = relationship(
        "AIPrediction", back_populates="image",
        cascade="all, delete-orphan"
    )


class AIPrediction(Base):
    """AI model prediction results for a food image."""
    __tablename__ = "ai_predictions"

    id = Column(Integer, primary_key=True, index=True)
    food_image_id = Column(
        Integer, ForeignKey("food_images.id", ondelete="CASCADE"),
        nullable=False
    )
    predicted_class = Column(String(100), nullable=False)
    freshness_label = Column(String(50), nullable=False)
    freshness_score = Column(Float, nullable=False)
    remaining_shelf_life = Column(Float, nullable=False)
    spoilage_probability = Column(Float, nullable=False)
    model_version = Column(String(50), nullable=False)
    predicted_at = Column(DateTime, default=datetime.utcnow)

    json_data = Column(Text, nullable=True)

    # Relationships
    image = relationship("FoodImage", back_populates="predictions")