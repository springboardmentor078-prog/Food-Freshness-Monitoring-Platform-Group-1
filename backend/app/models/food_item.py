from pydantic import BaseModel
from datetime import date
from typing import Optional


class FoodItem(BaseModel):
    name: str
    category: str
    purchase_date: date
    expiry_date: date
    quantity: float
    storage_type: str
    status: Optional[str] = "Fresh"