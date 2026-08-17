from fastapi import APIRouter, HTTPException, Depends

from app.models.food_item import FoodItem
from app.database.crud import (
    create_food_item,
    get_food_items,
    update_food_item,
    delete_food_item
)

from app.utils.auth_utils import get_current_user


router = APIRouter()


@router.post("/food")
def add_food(
    food_item: FoodItem,
    user_id: str = Depends(get_current_user)
):
    food_id = create_food_item(food_item, user_id)

    return {
        "message": "Food item added successfully",
        "id": food_id
    }


@router.get("/food")
def get_food(
    user_id: str = Depends(get_current_user)
):
    return get_food_items(user_id)


@router.put("/food/{food_id}")
def update_food(
    food_id: str,
    food_item: FoodItem,
    user_id: str = Depends(get_current_user)
):
    result = update_food_item(
        food_id,
        food_item,
        user_id
    )

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
def delete_food(
    food_id: str,
    user_id: str = Depends(get_current_user)
):
    result = delete_food_item(
        food_id,
        user_id
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Food item not found"
        )

    return {
        "message": "Food item deleted successfully",
        "id": food_id
    }