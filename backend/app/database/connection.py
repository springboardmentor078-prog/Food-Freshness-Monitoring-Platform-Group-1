import os
import certifi
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME", "food_freshness_db")

client = MongoClient(
    MONGODB_URL,
    tls=True,
    tlsCAFile=certifi.where()
)

db = client[DATABASE_NAME]

users_collection = db["users"]

def get_database():
    return db