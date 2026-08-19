from typing import Dict, Any, List, Optional

from .config import (ROTTEN_WEIGHT, MOLD_WEIGHT,)


# BASIC VISUAL FRESHNESS
def calculate_freshness_score(
    rotten_percentage: float,
    mold_percentage: float,
) -> float:

    rotten_percentage = max(
        0.0,
        float(rotten_percentage)
    )

    mold_percentage = max(
        0.0,
        float(mold_percentage)
    )

    freshness_score = (
        100.0
        - (
            rotten_percentage
            * ROTTEN_WEIGHT
        )
        - (
            mold_percentage
            * MOLD_WEIGHT
        )
    )

    freshness_score = max(
        0.0,
        min(
            100.0,
            freshness_score
        )
    )

    return round(
        freshness_score,
        2
    )

# CALCULATE VISUAL FRESHNESS FOR ONE FOOD
def calculate_food_freshness(
    food_object: Dict[str, Any]
) -> Dict[str, Any]:

    rotten_percentage = float(
        food_object.get(
            "rotten_percentage",
            0.0
        )
    )

    mold_percentage = float(
        food_object.get(
            "mold_percentage",
            0.0
        )
    )

    freshness_score = calculate_freshness_score(
        rotten_percentage,
        mold_percentage,
    )

    result = dict(food_object)

    # This is the visual freshness from segmentation.
    result["freshness_percentage"] = freshness_score

    return result


# CALCULATE ALL FOOD FRESHNESS
def calculate_all_food_freshness(
    food_objects: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:

    return [
        calculate_food_freshness(food)
        for food in food_objects
    ]

# STORAGE SCORE
def calculate_storage_score(
    temperature: float,
    humidity: float,
) -> float:

    temperature_penalty = (
        abs(float(temperature) - 25.0) * 2.0
    )

    humidity_penalty = (
        abs(float(humidity) - 60.0) * 0.5
    )

    score = 100.0 - (
        temperature_penalty
        + humidity_penalty
    )

    return max(
        0.0,
        min(
            100.0,
            score
        )
    )


# SHELF-LIFE SCORE
def calculate_shelf_life_score(
    shelf_life_days: float,
) -> float:

    shelf_life_days = max(
        0.0,
        float(shelf_life_days)
    )

    score = (
        shelf_life_days / 7.0
    ) * 100.0

    return max(
        0.0,
        min(
            100.0,
            score
        )
    )


# PRODUCT AGE SCORE
def calculate_product_age_score(
    storage_days: float,
) -> float:

    storage_days = max(
        0.0,
        float(storage_days)
    )

    score = 100.0 - (
        storage_days / 7.0
    ) * 100.0

    return max(
        0.0,
        min(
            100.0,
            score
        )
    )


# FINAL WEIGHTED FRESHNESS SCORE
def add_final_freshness_score(
    food_object: Dict[str, Any],
    storage_conditions: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:

    conditions = storage_conditions or {}

    # WEIGHTS
    VISUAL_WEIGHT = 0.40
    STORAGE_WEIGHT = 0.25
    SHELF_LIFE_WEIGHT = 0.20
    AGE_WEIGHT = 0.15

    # 1. VISUAL CONDITION
    visual_condition_score = float(
        food_object.get(
            "freshness_percentage",
            100.0
        )
    )

    # 2. STORAGE CONDITION
    temperature = float(
        conditions.get(
            "temperature_c",
            25.0
        )
    )

    humidity = float(
        conditions.get(
            "humidity_percent",
            60.0
        )
    )

    storage_condition_score = (
        calculate_storage_score(
            temperature,
            humidity
        )
    )

    # 3. SHELF LIFE
    shelf_life = food_object.get(
        "remaining_shelf_life"
    )

    if shelf_life is None:
        shelf_life = 0.0

    shelf_life_score = (
        calculate_shelf_life_score(
            float(shelf_life)
        )
    )

    # 4. PRODUCT AGE
    if conditions.get("storage_duration_hours") is not None:

        storage_days = (
            float(
                conditions[
                    "storage_duration_hours"
                ]
            ) / 24.0
        )

    else:

        storage_days = float(
            conditions.get(
                "storage_duration_days",
                0.0
            )
        )

    product_age_score = (
        calculate_product_age_score(
            storage_days
        )
    )

    # 5. FINAL WEIGHTED SCORE
    final_score = (
        visual_condition_score * VISUAL_WEIGHT
        +
        storage_condition_score * STORAGE_WEIGHT
        +
        shelf_life_score * SHELF_LIFE_WEIGHT
        +
        product_age_score * AGE_WEIGHT
    )

    final_score = max(
        0.0,
        min(
            100.0,
            final_score
        )
    )

    # STORE COMPONENT SCORES
    result = dict(food_object)

    result["visual_condition_score"] = round(
        visual_condition_score,
        2
    )

    result["storage_condition_score"] = round(
        storage_condition_score,
        2
    )

    result["shelf_life_score"] = round(
        shelf_life_score,
        2
    )

    result["product_age_score"] = round(
        product_age_score,
        2
    )

    result["freshness_score"] = round(
        final_score,
        2
    )

    return result