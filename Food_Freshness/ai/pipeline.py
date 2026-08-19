from typing import Any, Dict, List, Optional

from pathlib import Path
from uuid import uuid4

import cv2
import numpy as np

from .models import MODELS
from .classification import classify_food
from .segmentation import analyze_food_segmentation
from .freshness import (
    calculate_food_freshness,
    add_final_freshness_score,
)
from .shelf_life import predict_food_shelf_life


PROJECT_ROOT = Path(__file__).resolve().parent.parent

OUTPUT_DIR = PROJECT_ROOT / "outputs"

OUTPUT_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# ============================================================
# IMAGE DECODING
# ============================================================

def decode_image_bytes(
    image_bytes: bytes,
) -> np.ndarray:
    """
    Convert uploaded image bytes into an OpenCV image.
    """

    if not image_bytes:
        raise ValueError(
            "Image bytes are empty."
        )

    array = np.frombuffer(
        image_bytes,
        np.uint8,
    )

    image = cv2.imdecode(
        array,
        cv2.IMREAD_COLOR,
    )

    if image is None:
        raise ValueError(
            "Invalid or corrupted image format."
        )

    return image



def save_image(
    image: Optional[np.ndarray],
    output_path: Path,
) -> Optional[str]:

    if image is None:
        return None

    if not isinstance(
        image,
        np.ndarray,
    ):
        return None

    if image.size == 0:
        return None

    output_path.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    success = cv2.imwrite(
        str(output_path),
        image,
    )

    if not success:
        print(
            "[pipeline] Failed to save image:",
            output_path,
        )
        return None

    relative_path = output_path.relative_to(
        OUTPUT_DIR
    )

    url_path = (
        "/images/"
        + str(relative_path).replace(
            "\\",
            "/",
        )
    )

    return url_path


def mask_to_image(
    mask: Optional[np.ndarray],
    shape: tuple,
) -> Optional[np.ndarray]:
    """
    Convert boolean segmentation mask into
    a 3-channel image.
    """

    if mask is None:
        return None

    if not isinstance(
        mask,
        np.ndarray,
    ):
        return None

    if mask.size == 0:
        return None

    height, width = shape[:2]

    mask_visual = (
        mask.astype(np.uint8) * 255
    )

    if mask_visual.shape != (
        height,
        width,
    ):

        mask_visual = cv2.resize(
            mask_visual,
            (width, height),
            interpolation=cv2.INTER_NEAREST,
        )

    return cv2.cvtColor(
        mask_visual,
        cv2.COLOR_GRAY2BGR,
    )



def run_pipeline(
    image: np.ndarray,
    storage_conditions: Optional[
        Dict[str, Any]
    ] = None,
) -> Dict[str, Any]:
    if image is None:
        raise ValueError(
            "Input image is None."
        )

    if not isinstance(
        image,
        np.ndarray,
    ):
        raise TypeError(
            "Input image must be a NumPy array."
        )

    if image.size == 0:
        raise ValueError(
            "Input image is empty."
        )
    if (
        MODELS.segmentation_model is None
        or MODELS.classification_model is None
        or MODELS.shelf_life_model is None
    ):

        MODELS.load_all()
    food_objects = analyze_food_segmentation(
        image
    )

    if not food_objects:

        return {
            "status": "success",
            "message": (
                "No food items detected "
                "in the image."
            ),
            "total_items": 0,
            "items": [],
            "annotated_image": None,
        }
    processed_items: List[
        Dict[str, Any]
    ] = []

    annotated_image = image.copy()
    request_id = uuid4().hex

    request_output_dir = (
        OUTPUT_DIR / request_id
    )

    request_output_dir.mkdir(
        parents=True,
        exist_ok=True,
    )
    for food_index, food in enumerate(
        food_objects,
        start=1,
    ):
        crop = food.get(
            "crop"
        )

        if (
            crop is None
            or not isinstance(
                crop,
                np.ndarray,
            )
            or crop.size == 0
        ):
            continue
        try:

            classification = classify_food(
                crop
            )

            food[
                "classification_label"
            ] = classification.get(
                "class_name",
                food.get(
                    "class_name",
                    "Unknown",
                ),
            )

            food[
                "classification_confidence"
            ] = float(
                classification.get(
                    "confidence",
                    0.0,
                )
            )

        except Exception as e:

            print(
                "[pipeline] Classification failed:",
                e,
            )

            food[
                "classification_label"
            ] = food.get(
                "class_name",
                "Unknown",
            )

            food[
                "classification_confidence"
            ] = float(
                food.get(
                    "confidence",
                    0.0,
                )
            )


        food = calculate_food_freshness(
            food
        )

        food = predict_food_shelf_life(
            food,
            storage_conditions=storage_conditions,
        )


        food = add_final_freshness_score(
            food,
            storage_conditions or {},
        )


        bbox = food.get(
            "bbox"
        )

        if (
            bbox is not None
            and len(bbox) == 4
        ):

            x1, y1, x2, y2 = [
                int(v)
                for v in bbox
            ]


            cv2.rectangle(
                annotated_image,
                (x1, y1),
                (x2, y2),
                (255, 255, 255),
                2,
            )

            final_score = float(
                food.get(
                    "freshness_score",
                    food.get(
                        "final_freshness_score",
                        0.0,
                    ),
                )
            )

            classification_label = (
                food.get(
                    "classification_label",
                    "Unknown",
                )
            )

            label = (
                f"{classification_label} | "
                f"Freshness Score: "
                f"{final_score:.1f}/100"
            )

            cv2.putText(
                annotated_image,
                label,
                (
                    x1,
                    max(
                        20,
                        y1 - 8,
                    ),
                ),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.55,
                (255, 255, 255),
                2,
                cv2.LINE_AA,
            )


        food_mask_image = mask_to_image(
            food.get(
                "food_mask"
            ),
            image.shape,
        )

        rotten_mask_image = mask_to_image(
            food.get(
                "rotten_mask"
            ),
            image.shape,
        )

        mold_mask_image = mask_to_image(
            food.get(
                "mold_mask"
            ),
            image.shape,
        )

        segmented_crop = food.get(
            "segmented_crop"
        )


        freshness_percentage = float(
            food.get(
                "freshness_percentage",
                0.0,
            )
        )

        freshness_score = float(
            food.get(
                "freshness_score",
                food.get(
                    "final_freshness_score",
                    0.0,
                ),
            )
        )

        visual_condition_score = float(
            food.get(
                "visual_condition_score",
                freshness_percentage,
            )
        )

        storage_condition_score = float(
            food.get(
                "storage_condition_score",
                0.0,
            )
        )

        shelf_life_score = float(
            food.get(
                "shelf_life_score",
                0.0,
            )
        )

        product_age_score = float(
            food.get(
                "product_age_score",
                0.0,
            )
        )

        food_id = food.get(
            "food_id"
        )

        if food_id is None:
            food_id = food_index

        crop_url = save_image(
            crop,
            request_output_dir
            / "crops"
            / f"food_{food_id}.jpg",
        )

        food_mask_url = save_image(
            food_mask_image,
            request_output_dir
            / "masks"
            / f"food_{food_id}.png",
        )

        rotten_mask_url = save_image(
            rotten_mask_image,
            request_output_dir
            / "masks"
            / f"rotten_{food_id}.png",
        )

        mold_mask_url = save_image(
            mold_mask_image,
            request_output_dir
            / "masks"
            / f"mold_{food_id}.png",
        )

        segmented_url = save_image(
            segmented_crop,
            request_output_dir
            / "segmented"
            / f"food_{food_id}.jpg",
        )

        item = {

            "food_id": food_id,

            "category": food.get(
                "class_name"
            ),

            "classification": food.get(
                "classification_label",
                "Unknown",
            ),

            "confidence": round(
                float(
                    food.get(
                        "classification_confidence",
                        0.0,
                    )
                ),
                4,
            ),


            "rotten_percentage": round(
                float(
                    food.get(
                        "rotten_percentage",
                        0.0,
                    )
                ),
                2,
            ),

            "mold_percentage": round(
                float(
                    food.get(
                        "mold_percentage",
                        0.0,
                    )
                ),
                2,
            ),

            "freshness_percentage": round(
                freshness_percentage,
                2,
            ),

            "freshness_score": round(
                freshness_score,
                2,
            ),

            "visual_condition_score": round(
                visual_condition_score,
                2,
            ),

            "storage_condition_score": round(
                storage_condition_score,
                2,
            ),

            "shelf_life_score": round(
                shelf_life_score,
                2,
            ),

            "product_age_score": round(
                product_age_score,
                2,
            ),

            "shelf_life": {

                "remaining_days": (
                    food.get(
                        "remaining_shelf_life"
                    )
                ),

                "units": (
                    food.get(
                        "shelf_life_units",
                        "days",
                    )
                ),

                "model_used": (
                    food.get(
                        "shelf_life_model_used",
                        False,
                    )
                ),

                "storage_conditions": (
                    food.get(
                        "shelf_life_features"
                    )
                ),
            },

            "images": {

                "crop": crop_url,

                "food_mask": food_mask_url,

                "rotten_mask": rotten_mask_url,

                "mold_mask": mold_mask_url,

                "segmented": segmented_url,
            },
        }

        processed_items.append(
            item
        )

    annotated_image_url = save_image(
        annotated_image,
        request_output_dir
        / "annotated"
        / "result.jpg",
    )

    return {

        "status": "success",

        "total_items": len(
            processed_items
        ),

        "annotated_image": (
            annotated_image_url
        ),

        "items": processed_items,
    }


if __name__ == "__main__":

    print("=" * 60)
    print("FOOD FRESHNESS PIPELINE")
    print("=" * 60)

    print("Pipeline module loaded successfully.")
    print()
    print("Pipeline flow:")
    print("  1. Segmentation")
    print("  2. Food Classification")
    print("  3. Visual Freshness")
    print("  4. Shelf-Life Prediction")
    print("  5. Final Weighted Freshness Score")
    print("  6. Save Generated Images")
    print("  7. Return Image URLs")
    print()
    print("Use:")
    print("  run_pipeline(")
    print("      image,")
    print("      storage_conditions")
    print("  )")
    
    print("=" * 60)

