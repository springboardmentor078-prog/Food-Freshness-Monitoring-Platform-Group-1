from fastapi import APIRouter, HTTPException

from app.models.food_item import FoodItem
from app.database.crud import (
    create_food_item,
    get_food_items,
    update_food_item,
    delete_food_item
)


router = APIRouter()


@router.post("/food")
def add_food(food_item: FoodItem):
    food_id = create_food_item(food_item)

    return {
        "message": "Food item added successfully",
        "id": food_id
    }


@router.get("/food")
def get_food():
    return get_food_items()


@router.put("/food/{food_id}")
def update_food(food_id: str, food_item: FoodItem):
    result = update_food_item(food_id, food_item)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Food item not found"
        )

    return {
        "message": "Food item updated successfully",
        "id": food_id
    }


@router.delete("/food/{food_id}")
def delete_food(food_id: str):
    result = delete_food_item(food_id)

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Food item not found"
        )

    return {
        "message": "Food item deleted successfully",
        "id": food_id
    }