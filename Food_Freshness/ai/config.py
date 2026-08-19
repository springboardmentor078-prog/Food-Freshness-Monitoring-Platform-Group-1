from pathlib import Path


# BASE DIRECTORIES
AI_DIR = Path(__file__).resolve().parent
BACKEND_DIR = AI_DIR.parent

# MODEL PATHS
CLASSIFICATION_MODEL_PATH = (
    BACKEND_DIR/ "model_files"/ "classification"/ "best.pt"
)

SEGMENTATION_MODEL_PATH = (
    BACKEND_DIR/ "model_files"/ "segmentation"/ "best.pt"
)

SHELF_LIFE_MODEL_PATH = (
    BACKEND_DIR/ "model_files"/ "shelf_life"/ "shelf_life_xgboost_model.pkl"
)

SHELF_LIFE_FEATURE_COLUMNS_PATH = (
    BACKEND_DIR/ "model_files"/ "shelf_life"/ "model_feature_columns.pkl"
)


# YOLO SETTINGS
CONF_THRESHOLD = 0.25
IOU_THRESHOLD = 0.45
IMG_SIZE = 640
CLASSIFICATION_IMG_SIZE = 224

# SEGMENTATION CLASS MAPPING
SEGMENTATION_CLASSES = {
    0: "Fruit",
    1: "Mold",
    2: "Rotten",
    3: "Vegetable",
}

# FOOD INSTANCE & SPOILAGE CLASSES
FOOD_INSTANCE_CLASS_NAMES = {
    "Fruit",
    "Vegetable",
}

SPOILAGE_CLASS_NAMES = {
    "Rotten",
    "Mold",
}

# FRESHNESS SCORE WEIGHTS
ROTTEN_WEIGHT = 1.0
MOLD_WEIGHT = 1.2

VISUAL_WEIGHT = 0.40
STORAGE_WEIGHT = 0.25
SHELF_LIFE_WEIGHT = 0.20
AGE_WEIGHT = 0.15

# DEFAULT USER INPUTS (FALLBACKS)
DEFAULT_TEMPERATURE_C = 25.0
DEFAULT_HUMIDITY_PERCENT = 60.0
DEFAULT_STORAGE_AREA = "Room Temperature"
DEFAULT_PACKAGING_MATERIAL = "Loose"
DEFAULT_STORAGE_DURATION_DAYS = 0.0

# VISUALIZATION COLORS — BGR
VIZ_COLORS = {
    "food_outline": (60, 200, 60),
    "rotten_mask": (30, 30, 220),
    "mold_mask": (0, 200, 220),
    "text_bg": (20, 20, 20),
    "text_fg": (255, 255, 255),
}

DISPLAY_IMAGE_WIDTH = 14
DISPLAY_IMAGE_HEIGHT = 10

# PRINT CONFIGURATION
print("Configuration loaded successfully.")
print(f"Classification model : {CLASSIFICATION_MODEL_PATH}")
print(f"Segmentation model   : {SEGMENTATION_MODEL_PATH}")
print(f"Shelf-life model     : {SHELF_LIFE_MODEL_PATH}")
print(f"Feature columns      : {SHELF_LIFE_FEATURE_COLUMNS_PATH}")