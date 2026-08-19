"""
LightGBM Shelf-Life Prediction Service.
Loads shelf_life_model.txt and predicts remaining shelf life in days.
"""
import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# Resolve model path
import os

# Use absolute pathing to ensure it finds the file regardless of where the server runs
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, "model", "shelf life", "shelf_life_final", "shelf_life_model.txt")

# Feature definitions from feature_metadata.json
FEATURE_NAMES = [
    "produce_type",
    "temperature_c",
    "humidity_pct",
    "storage_area",
    "packaging_material",
    "freshness_pct"
]

CATEGORICAL_FEATURES = [
    "produce_type",
    "storage_area",
    "packaging_material"
]

# Known produce types from the training dataset
KNOWN_PRODUCE = [
    "Apple", "Banana", "Bellpepper", "Bitter_Gourd", "Carrot", "Cucumber",
    "Grape", "Grapes", "Jujube", "Kaki", "Lemon", "Lime", "Lulo", "Mango",
    "Orange", "Papaya", "Peach", "Pear", "Pomegranate", "Potato",
    "Strawberry", "Tamarillo", "Tomato", "Watermelon"
]

# Default shelf life lookup (days) for unknown produce or fallback
DEFAULT_SHELF_LIFE = {
    "Fruits": 7.0,
    "Vegetables": 5.0,
    "Dairy Products": 10.0,
    "Meat & Poultry": 3.0,
    "Seafood": 2.0,
    "Bakery Products": 4.0,
    "Packaged Foods": 30.0,
    "Beverages": 14.0,
}


class ShelfLifeService:
    """LightGBM model for remaining shelf-life prediction."""

    def __init__(self):
        self.booster = None
        self._load_model()

    def _load_model(self):
        """Load the LightGBM model from disk."""
        try:
            import lightgbm as lgb
            if os.path.exists(MODEL_PATH):
                self.booster = lgb.Booster(model_file=MODEL_PATH)
                logger.info(f"Shelf-life model loaded from {MODEL_PATH}")
            else:
                logger.warning(
                    f"Shelf-life model not found at {MODEL_PATH}. "
                    "Will use heuristic fallback."
                )
        except ImportError:
            logger.warning(
                "lightgbm not installed. "
                "Shelf-life will use heuristic fallback."
            )

    def predict(
        self,
        produce_type: str,
        temperature_c: float,
        humidity_pct: float,
        storage_area: str,
        packaging_material: str,
        freshness_pct: float
    ) -> dict:
        """
        Predict remaining shelf life.

        Returns:
            dict with keys:
                - remaining_days: float
                - remaining_hours: float
                - confidence: str ('high', 'medium', 'low')
        """
        if self.booster is not None:
            try:
                return self._model_predict(
                    produce_type, temperature_c, humidity_pct,
                    storage_area, packaging_material, freshness_pct
                )
            except Exception as e:
                logger.error(f"Shelf-life prediction failed: {e}")
                return self._heuristic_predict(
                    produce_type, freshness_pct, temperature_c
                )
        else:
            return self._heuristic_predict(
                produce_type, freshness_pct, temperature_c
            )

    def _model_predict(
        self,
        produce_type: str,
        temperature_c: float,
        humidity_pct: float,
        storage_area: str,
        packaging_material: str,
        freshness_pct: float
    ) -> dict:
        """Run LightGBM inference."""
        import pandas as pd

        # Normalize produce type to match training data
        normalized_produce = self._normalize_produce(produce_type)

        input_data = {
            "produce_type": [normalized_produce],
            "temperature_c": [float(temperature_c)],
            "humidity_pct": [float(humidity_pct)],
            "storage_area": [storage_area],
            "packaging_material": [packaging_material],
            "freshness_pct": [float(freshness_pct)]
        }

        df = pd.DataFrame(input_data)[FEATURE_NAMES]

        # Cast categorical columns
        for col in CATEGORICAL_FEATURES:
            df[col] = df[col].astype("category")

        predicted_days = float(self.booster.predict(df)[0])
        predicted_days = max(0.0, round(predicted_days, 2))
        predicted_hours = round(predicted_days * 24.0, 1)

        # Confidence based on whether produce type was in training set
        confidence = "high" if normalized_produce in KNOWN_PRODUCE else "medium"

        return {
            "remaining_days": predicted_days,
            "remaining_hours": predicted_hours,
            "confidence": confidence
        }

    def _normalize_produce(self, name: str) -> str:
        """Try to match produce name to known training categories."""
        # Direct match
        if name in KNOWN_PRODUCE:
            return name

        # Case-insensitive match
        name_lower = name.lower().strip()
        for known in KNOWN_PRODUCE:
            if known.lower() == name_lower:
                return known

        # Partial match (e.g. "Green Apple" -> "Apple")
        for known in KNOWN_PRODUCE:
            if known.lower() in name_lower or name_lower in known.lower():
                return known

        # Return as-is (LightGBM can handle unseen categories)
        return name

    def _heuristic_predict(
        self,
        produce_type: str,
        freshness_pct: float,
        temperature_c: float
    ) -> dict:
        """
        Fallback heuristic when model is unavailable.
        Uses freshness percentage and temperature to estimate shelf life.
        """
        # Base shelf life in days
        base_days = 7.0  # Default

        # Temperature factor: lower temp = longer shelf life
        if temperature_c <= 4:
            temp_factor = 1.0
        elif temperature_c <= 10:
            temp_factor = 0.6
        elif temperature_c <= 20:
            temp_factor = 0.3
        else:
            temp_factor = 0.15

        # Freshness factor
        freshness_factor = freshness_pct / 100.0

        predicted_days = base_days * temp_factor * freshness_factor
        predicted_days = max(0.0, round(predicted_days, 2))

        return {
            "remaining_days": predicted_days,
            "remaining_hours": round(predicted_days * 24.0, 1),
            "confidence": "low"
        }
