from fastapi import APIRouter, HTTPException
from app.database.connection import db
from app.models.user import User
from app.database.crud import create_user
from app.utils.auth_utils import verify_password
from app.utils.auth_utils import verify_password, create_access_token

router = APIRouter()

users_collection = db["users"]

@router.post("/register")
def register(user: User):
    user_id = create_user(user)

    if user_id is None:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    return {
        "message": "User registered successfully",
        "id": user_id
    }
@router.post("/login")
def login(email: str, password: str):
    user = users_collection.find_one({
        "email": email
    })

    if not user:
        return {"message": "Invalid email or password"}

    if not verify_password(password, user["password"]):
        return {"message": "Invalid email or password"}

    token = create_access_token({
    "user_id": str(user["_id"]),
    "email": user["email"],
    "role": user["role"]
})

    return {
    "message": "Login successful",
    "access_token": token,
    "token_type": "bearer",
    "user_id": str(user["_id"]),
    "name": user["name"],
    "email": user["email"]
}
