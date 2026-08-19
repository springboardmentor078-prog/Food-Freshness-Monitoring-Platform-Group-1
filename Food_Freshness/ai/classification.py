from typing import Any, Dict, Optional

import numpy as np

from .models import MODELS
from .config import CLASSIFICATION_IMG_SIZE


def classify_food(
    image: np.ndarray,
    model: Optional[Any] = None,
) -> Dict[str, Any]:

    model = model or MODELS.classification_model

    if model is None:
        raise RuntimeError(
            "Classification model is not loaded."
        )

    if image is None:
        raise ValueError(
            "Input image is None."
        )

    if not isinstance(image, np.ndarray):
        raise TypeError(
            "Input image must be a NumPy array."
        )

    if image.size == 0:
        raise ValueError(
            "Input image is empty."
        )

    try:
        results = model.predict(
            source=image,
            imgsz=CLASSIFICATION_IMG_SIZE,
            verbose=False,
        )
    except Exception as e:
        raise RuntimeError(
            f"Classification inference failed: {e}"
        ) from e

    if not results:
        raise RuntimeError(
            "Classification model returned no results."
        )

    result = results[0]

    if result.probs is None:
        raise RuntimeError(
            "Classification result contains no probabilities."
        )

    class_id = int(result.probs.top1)
    confidence = float(
        result.probs.top1conf.item()
    )

    class_name = model.names.get(
        class_id,
        str(class_id),
    )

    return {
        "class_id": class_id,
        "class_name": class_name,
        "confidence": confidence,
    }