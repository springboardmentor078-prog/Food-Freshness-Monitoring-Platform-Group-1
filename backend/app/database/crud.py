from datetime import datetime, time
from bson import ObjectId

from app.database.connection import db
from app.models.food_item import FoodItem
from app.services.freshness import calculate_freshness

from app.models.user import User
from app.utils.auth_utils import hash_password
collection = db["food_items"]


def create_food_item(food_item: FoodItem):
    data = food_item.model_dump()

    if data.get("purchase_date"):
        data["purchase_date"] = datetime.combine(
            data["purchase_date"],
            time.min
        )

    if data.get("expiry_date"):
        data["expiry_date"] = datetime.combine(
            data["expiry_date"],
            time.min
        )

    result = collection.insert_one(data)

    return str(result.inserted_id)


def get_food_items():
    food_items = list(collection.find())

    for item in food_items:
        item["_id"] = str(item["_id"])

    return food_items


def update_food_item(food_id: str, food_item: FoodItem):
    data = food_item.model_dump()

    if data.get("purchase_date"):
        data["purchase_date"] = datetime.combine(
            data["purchase_date"],
            time.min
        )

    if data.get("expiry_date"):
        data["expiry_date"] = datetime.combine(
            data["expiry_date"],
            time.min
        )
    data["status"] = calculate_freshness(food_item.expiry_date)

    result = collection.update_one(
        {"_id": ObjectId(food_id)},
        {"$set": data}
    )

    if result.matched_count == 0:
        return None

    return True


def delete_food_item(food_id: str):
    result = collection.delete_one(
        {"_id": ObjectId(food_id)}
    )

    if result.deleted_count == 0:
        return False

    return True

users_collection = db["users"]


def create_user(user: User):
    existing_user = users_collection.find_one({"email": user.email})

    if existing_user:
        return None

    hashed_password = hash_password(user.password)

    user_data = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "role": user.role
    }

    result = users_collection.insert_one(user_data)

    return str(result.inserted_id)