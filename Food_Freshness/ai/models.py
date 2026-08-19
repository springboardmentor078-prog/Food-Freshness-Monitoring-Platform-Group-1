import joblib

from ultralytics import YOLO

from .config import (
    CLASSIFICATION_MODEL_PATH,
    SEGMENTATION_MODEL_PATH,
    SHELF_LIFE_MODEL_PATH,
    SHELF_LIFE_FEATURE_COLUMNS_PATH,
)


# MODEL CONTAINER
class ModelManager:

    def __init__(self):

        self.classification_model = None
        self.segmentation_model = None
        self.shelf_life_model = None
        self.shelf_life_feature_columns = None


    # LOAD CLASSIFICATION MODEL
    def load_classification_model(self):

        print("Loading classification model...")

        self.classification_model = YOLO(
            str(CLASSIFICATION_MODEL_PATH)
        )

        print("Classification model loaded.")

    # LOAD SEGMENTATION MODEL
    def load_segmentation_model(self):

        print("Loading segmentation model...")

        self.segmentation_model = YOLO(
            str(SEGMENTATION_MODEL_PATH)
        )

        print("Segmentation model loaded.")


    # LOAD XGBOOST MODEL
    def load_shelf_life_model(self):

        print("Loading shelf-life XGBoost model...")

        self.shelf_life_model = joblib.load(
            SHELF_LIFE_MODEL_PATH
        )

        print("Shelf-life model loaded.")


    # LOAD FEATURE COLUMNS
    def load_feature_columns(self):

        print("Loading shelf-life feature columns...")

        self.shelf_life_feature_columns = joblib.load(
            SHELF_LIFE_FEATURE_COLUMNS_PATH
        )

        print("Feature columns loaded.")


    # LOAD EVERYTHING
    def load_all(self):

        self.load_classification_model()

        self.load_segmentation_model()

        self.load_shelf_life_model()

        self.load_feature_columns()

        print()
        print("=" * 60)
        print("ALL AI MODELS LOADED SUCCESSFULLY")
        print("=" * 60)


# CREATE MODEL MANAGER
MODELS = ModelManager()

if __name__ == "__main__":

    MODELS.load_all()

    print()
    print("Classification classes:")
    print(MODELS.classification_model.names)

    print()
    print("Segmentation classes:")
    print(MODELS.segmentation_model.names)

    print()
    print("Shelf-life feature columns:")

    print(
        MODELS.shelf_life_feature_columns
    )