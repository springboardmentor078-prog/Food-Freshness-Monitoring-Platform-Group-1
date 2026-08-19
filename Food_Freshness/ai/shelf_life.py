from typing import Any, Dict, List, Optional

import numpy as np
import pandas as pd

from .models import MODELS
from .config import (
    DEFAULT_TEMPERATURE_C,
    DEFAULT_HUMIDITY_PERCENT,
    DEFAULT_STORAGE_AREA,
    DEFAULT_PACKAGING_MATERIAL,
    DEFAULT_STORAGE_DURATION_DAYS,
)


def prepare_shelf_life_features(
    food_type: str,
    freshness_percentage: float,
    rotten_percentage: float,
    mold_percentage: float,
    storage_conditions: Optional[Dict[str, Any]] = None,
    food_class: str = "Vegetable",
) -> Dict[str, Any]:

    conditions = storage_conditions or {}

    if conditions.get("storage_duration_hours") is not None:
        duration_days = (
            float(conditions["storage_duration_hours"]) / 24.0
        )
    else:
        duration_days = float(
            conditions.get(
                "storage_duration_days",
                DEFAULT_STORAGE_DURATION_DAYS,
            )
        )

    return {
        "food_type": str(food_type),
        "food_class": str(food_class),
        "freshness_percentage": float(freshness_percentage),
        "rotten_percentage": float(rotten_percentage),
        "mold_percentage": float(mold_percentage),
        "temperature_c": float(
            conditions.get(
                "temperature_c",
                DEFAULT_TEMPERATURE_C,
            )
        ),
        "humidity_percent": float(
            conditions.get(
                "humidity_percent",
                DEFAULT_HUMIDITY_PERCENT,
            )
        ),
        "storage_area": str(
            conditions.get(
                "storage_area",
                DEFAULT_STORAGE_AREA,
            )
        ),
        "packaging_type": str(
            conditions.get(
                "packaging_type",
                DEFAULT_PACKAGING_MATERIAL,
            )
        ),
        "storage_duration_days": duration_days,
    }


def create_shelf_life_dataframe(
    features: Dict[str, Any],
    feature_columns: List[str],
) -> pd.DataFrame:

    temperature_c = features["temperature_c"]
    humidity_percent = features["humidity_percent"]
    storage_duration_days = features["storage_duration_days"]

    storage_area = features["storage_area"]
    packaging_material = features["packaging_type"]

    freshness_percentage = features["freshness_percentage"]

    food_name = features["food_type"]
    food_class = features.get(
        "food_class",
        "Vegetable",
    )

    model_features = {
        column: 0
        for column in feature_columns
    }

    if "temperature_c" in model_features:
        model_features["temperature_c"] = temperature_c

    if "humidity_percent" in model_features:
        model_features["humidity_percent"] = humidity_percent

    if "freshness_percentage" in model_features:
        model_features["freshness_percentage"] = (
            freshness_percentage
        )

    if "storage_duration_days" in model_features:
        model_features["storage_duration_days"] = (
            storage_duration_days
        )

    food_category_column = (
        f"food_category_{food_name}"
    )

    if food_category_column in model_features:
        model_features[food_category_column] = 1

    if "food_type_Vegetable" in model_features:
        if food_class == "Vegetable":
            model_features["food_type_Vegetable"] = 1

    storage_area_column = (
        f"storage_area_{storage_area}"
    )

    if storage_area_column in model_features:
        model_features[storage_area_column] = 1

    packaging_column = (
        f"packaging_material_{packaging_material}"
    )

    if packaging_column in model_features:
        model_features[packaging_column] = 1

    dataframe = pd.DataFrame(
        [
            [
                model_features[column]
                for column in feature_columns
            ]
        ],
        columns=feature_columns,
    )

    return dataframe


def predict_shelf_life(
    features: Dict[str, Any],
    model: Optional[Any] = None,
    feature_columns: Optional[List[str]] = None,
) -> Dict[str, Any]:

    model = model or MODELS.shelf_life_model

    feature_columns = (
        feature_columns
        or MODELS.shelf_life_feature_columns
    )

    if model is None:
        return {
            "remaining_shelf_life": None,
            "shelf_life_units": "days",
            "features_used": features,
            "model_used": False,
            "error": "Shelf-life model is not loaded.",
        }

    if not feature_columns:
        return {
            "remaining_shelf_life": None,
            "shelf_life_units": "days",
            "features_used": features,
            "model_used": False,
            "error": "Shelf-life feature columns are not loaded.",
        }

    try:

        dataframe = create_shelf_life_dataframe(
            features,
            feature_columns,
        )

        prediction = model.predict(dataframe)

        value = float(prediction[0])

        value = max(0.0, value)

        return {
            "remaining_shelf_life": round(
                value,
                2,
            ),
            "shelf_life_units": "days",
            "features_used": features,
            "model_used": True,
            "model_features": dataframe.iloc[0].to_dict(),
        }

    except Exception as e:

        print(
            f"[shelf_life] Prediction failed: {e}"
        )

        return {
            "remaining_shelf_life": None,
            "shelf_life_units": "days",
            "features_used": features,
            "model_used": False,
            "error": str(e),
        }


def predict_food_shelf_life(
    food_object: Dict[str, Any],
    storage_conditions: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:

    food_type = (
        food_object.get("classification_label")
        or food_object.get("class_name")
        or "Unknown"
    )

    food_class = (
        food_object.get("food_class")
        or food_object.get("class_name")
        or "Vegetable"
    )

    freshness = float(
        food_object.get(
            "freshness_percentage",
            100.0,
        )
    )

    rotten = float(
        food_object.get(
            "rotten_percentage",
            0.0,
        )
    )

    mold = float(
        food_object.get(
            "mold_percentage",
            0.0,
        )
    )

    features = prepare_shelf_life_features(
        food_type=food_type,
        freshness_percentage=freshness,
        rotten_percentage=rotten,
        mold_percentage=mold,
        storage_conditions=storage_conditions,
        food_class=food_class,
    )

    prediction = predict_shelf_life(features)

    result = dict(food_object)

    result["remaining_shelf_life"] = (
        prediction["remaining_shelf_life"]
    )

    result["shelf_life_units"] = (
        prediction["shelf_life_units"]
    )

    result["shelf_life_features"] = (
        prediction["features_used"]
    )

    result["shelf_life_model_used"] = (
        prediction["model_used"]
    )

    result["shelf_life_error"] = (
        prediction.get("error")
    )

    result["shelf_life_model_features"] = (
        prediction.get("model_features")
    )

    return result


if __name__ == "__main__":

    MODELS.load_all()

    print()
    print(
        "Shelf-life model loaded:",
        MODELS.shelf_life_model is not None,
    )

    print(
        "Feature columns loaded:",
        MODELS.shelf_life_feature_columns is not None,
    )

    print(
        "Number of feature columns:",
        len(
            MODELS.shelf_life_feature_columns
            or []
        ),
    )

    test_features = prepare_shelf_life_features(
        food_type="Carrot_Rotten",
        freshness_percentage=96.96,
        rotten_percentage=1.77,
        mold_percentage=1.06,
        storage_conditions={
            "temperature_c": 25.0,
            "humidity_percent": 60.0,
            "storage_area": "Room Temperature",
            "packaging_type": "Loose",
            "storage_duration_days": 0.0,
        },
        food_class="Vegetable",
    )

    print()
    print("Test features:")
    print(test_features)

    dataframe = create_shelf_life_dataframe(
        test_features,
        MODELS.shelf_life_feature_columns,
    )

    print()
    print("Active XGBoost features:")

    for column, value in dataframe.iloc[0].items():
        if value != 0:
            print(
                f"  {column}: {value}"
            )

    result = predict_shelf_life(
        test_features
    )

    print()
    print(
        "Predicted shelf life:",
        result["remaining_shelf_life"],
    )