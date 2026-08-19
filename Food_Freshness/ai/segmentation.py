from typing import Any, Dict, List, Optional

import cv2
import numpy as np
from ultralytics import YOLO

from .models import MODELS
from .config import (
    CONF_THRESHOLD,
    IOU_THRESHOLD,
    IMG_SIZE,
    SEGMENTATION_CLASSES,
    FOOD_INSTANCE_CLASS_NAMES,
    SPOILAGE_CLASS_NAMES,
)


def resize_mask(
    mask_data: np.ndarray,
    width: int,
    height: int,
) -> np.ndarray:

    if mask_data is None or mask_data.size == 0:
        return np.zeros(
            (height, width),
            dtype=bool,
        )

    return cv2.resize(
        mask_data.astype(np.float32),
        (width, height),
        interpolation=cv2.INTER_NEAREST,
    ) > 0.5


def create_mask_image(
    image: np.ndarray,
    mask: np.ndarray,
) -> np.ndarray:

    if image is None or image.size == 0:
        return image

    output = np.zeros_like(image)

    if mask is None:
        return output

    mask = mask.astype(bool)

    if mask.shape[:2] != image.shape[:2]:
        mask = cv2.resize(
            mask.astype(np.uint8),
            (image.shape[1], image.shape[0]),
            interpolation=cv2.INTER_NEAREST,
        ).astype(bool)

    output[mask] = image[mask]

    return output


def create_masked_crop(
    image: np.ndarray,
    mask: np.ndarray,
    bbox: List[int],
) -> np.ndarray:

    x1, y1, x2, y2 = bbox

    crop = image[
        y1:y2,
        x1:x2,
    ].copy()

    if crop.size == 0:
        return crop

    crop_mask = mask[
        y1:y2,
        x1:x2,
    ]

    if crop_mask.shape[:2] != crop.shape[:2]:
        crop_mask = cv2.resize(
            crop_mask.astype(np.uint8),
            (crop.shape[1], crop.shape[0]),
            interpolation=cv2.INTER_NEAREST,
        ).astype(bool)

    output = np.zeros_like(crop)

    output[crop_mask] = crop[crop_mask]

    return output


def create_segmentation_overlay(
    image: np.ndarray,
    food_mask: np.ndarray,
    rotten_mask: np.ndarray,
    mold_mask: np.ndarray,
) -> np.ndarray:

    output = image.copy()

    if output is None or output.size == 0:
        return output

    h, w = output.shape[:2]

    def prepare_mask(mask):
        if mask is None:
            return np.zeros(
                (h, w),
                dtype=bool,
            )

        mask = mask.astype(bool)

        if mask.shape != (h, w):
            mask = cv2.resize(
                mask.astype(np.uint8),
                (w, h),
                interpolation=cv2.INTER_NEAREST,
            ).astype(bool)

        return mask

    food_mask = prepare_mask(food_mask)
    rotten_mask = prepare_mask(rotten_mask)
    mold_mask = prepare_mask(mold_mask)

    if food_mask.any():

        overlay = np.zeros_like(output)

        overlay[:, :, 1] = 255

        output[food_mask] = cv2.addWeighted(
            output[food_mask],
            0.55,
            overlay[food_mask],
            0.45,
            0,
        )

    if rotten_mask.any():

        overlay = np.zeros_like(output)

        overlay[:, :, 2] = 255

        output[rotten_mask] = cv2.addWeighted(
            output[rotten_mask],
            0.45,
            overlay[rotten_mask],
            0.55,
            0,
        )

    if mold_mask.any():

        overlay = np.zeros_like(output)

        overlay[:, :, 1] = 255
        overlay[:, :, 2] = 255

        output[mold_mask] = cv2.addWeighted(
            output[mold_mask],
            0.45,
            overlay[mold_mask],
            0.55,
            0,
        )

    return output


def segment_food_instances(
    image: np.ndarray,
    model: Optional[YOLO] = None,
    conf: float = CONF_THRESHOLD,
    iou: float = IOU_THRESHOLD,
    imgsz: int = IMG_SIZE,
) -> Dict[str, Any]:

    model = model or MODELS.segmentation_model

    if model is None:
        raise RuntimeError(
            "Segmentation model is not loaded."
        )

    if (
        image is None
        or not isinstance(image, np.ndarray)
        or image.size == 0
    ):
        raise ValueError(
            "Input image is invalid or empty."
        )

    predictions = model.predict(
        source=image,
        conf=conf,
        iou=iou,
        imgsz=imgsz,
        verbose=False,
    )

    h, w = image.shape[:2]

    empty_result = {
        "food_objects": [],
        "rotten_mask": np.zeros(
            (h, w),
            dtype=bool,
        ),
        "mold_mask": np.zeros(
            (h, w),
            dtype=bool,
        ),
    }

    if not predictions:
        return empty_result

    result = predictions[0]

    if (
        result.boxes is None
        or len(result.boxes) == 0
    ):
        return empty_result

    boxes = result.boxes
    masks = result.masks

    food_objects = []

    rotten_mask_all = np.zeros(
        (h, w),
        dtype=bool,
    )

    mold_mask_all = np.zeros(
        (h, w),
        dtype=bool,
    )

    food_id = 0

    for i in range(len(boxes)):

        class_id = int(
            boxes.cls[i].item()
        )

        class_name = SEGMENTATION_CLASSES.get(
            class_id,
            model.names.get(
                class_id,
                str(class_id),
            ),
        )

        confidence = float(
            boxes.conf[i].item()
        )

        if masks is None:

            mask = np.zeros(
                (h, w),
                dtype=bool,
            )

        else:

            mask = resize_mask(
                masks.data[i]
                .detach()
                .cpu()
                .numpy(),
                w,
                h,
            )

        if class_name == "Rotten":

            rotten_mask_all |= mask
            continue

        if class_name == "Mold":

            mold_mask_all |= mask
            continue

        if class_name not in FOOD_INSTANCE_CLASS_NAMES:
            continue

        x1, y1, x2, y2 = [
            int(v)
            for v in boxes.xyxy[i].tolist()
        ]

        x1 = max(
            0,
            min(x1, w - 1),
        )

        y1 = max(
            0,
            min(y1, h - 1),
        )

        x2 = max(
            0,
            min(x2, w),
        )

        y2 = max(
            0,
            min(y2, h),
        )

        if x2 <= x1 or y2 <= y1:
            continue

        food_id += 1

        crop = image[
            y1:y2,
            x1:x2,
        ].copy()

        food_area = int(
            mask.sum()
        )

        if food_area == 0:

            mask = np.zeros(
                (h, w),
                dtype=bool,
            )

            mask[
                y1:y2,
                x1:x2
            ] = True

            food_area = int(
                mask.sum()
            )

        masked_food_crop = create_masked_crop(
            image,
            mask,
            [x1, y1, x2, y2],
        )

        food_mask_image = create_mask_image(
            crop,
            mask[y1:y2, x1:x2],
        )

        food_objects.append({
            "food_id": food_id,
            "class_id": class_id,
            "class_name": class_name,
            "confidence": confidence,
            "bbox": [
                x1,
                y1,
                x2,
                y2,
            ],
            "mask": mask,
            "instance_mask": mask,
            "food_mask": mask[
                y1:y2,
                x1:x2
            ].copy(),
            "crop": crop,
            "masked_food_crop": masked_food_crop,
            "food_mask_image": food_mask_image,
            "food_area_pixels": food_area,
        })

    return {
        "food_objects": food_objects,
        "rotten_mask": rotten_mask_all,
        "mold_mask": mold_mask_all,
    }


def segment_spoilage(
    image: np.ndarray,
    model: Optional[YOLO] = None,
) -> Dict[str, Any]:

    model = model or MODELS.segmentation_model

    result = segment_food_instances(
        image=image,
        model=model,
    )

    return {
        "rotten_mask": result[
            "rotten_mask"
        ],
        "mold_mask": result[
            "mold_mask"
        ],
    }


def analyze_food_segmentation(
    image: np.ndarray,
    model: Optional[YOLO] = None,
) -> List[Dict[str, Any]]:

    model = model or MODELS.segmentation_model

    segmentation = segment_food_instances(
        image=image,
        model=model,
    )

    food_objects = segmentation[
        "food_objects"
    ]

    rotten_mask_all = segmentation[
        "rotten_mask"
    ]

    mold_mask_all = segmentation[
        "mold_mask"
    ]

    results = []

    for food in food_objects:

        food_mask = food["mask"]

        rotten_overlap = (
            food_mask
            & rotten_mask_all
        )

        mold_overlap = (
            food_mask
            & mold_mask_all
        )

        food_area = max(
            1,
            int(food_mask.sum()),
        )

        rotten_area = int(
            rotten_overlap.sum()
        )

        mold_area = int(
            mold_overlap.sum()
        )

        rotten_percentage = (
            rotten_area
            / food_area
        ) * 100.0

        mold_percentage = (
            mold_area
            / food_area
        ) * 100.0

        crop = food["crop"]

        x1, y1, x2, y2 = food["bbox"]

        crop_food_mask = (
            food_mask[
                y1:y2,
                x1:x2
            ].copy()
        )

        crop_rotten_mask = (
            rotten_overlap[
                y1:y2,
                x1:x2
            ].copy()
        )

        crop_mold_mask = (
            mold_overlap[
                y1:y2,
                x1:x2
            ].copy()
        )

        food_mask_image = create_mask_image(
            crop,
            crop_food_mask,
        )

        rotten_mask_image = create_mask_image(
            crop,
            crop_rotten_mask,
        )

        mold_mask_image = create_mask_image(
            crop,
            crop_mold_mask,
        )

        segmented_crop = (
            create_segmentation_overlay(
                crop,
                crop_food_mask,
                crop_rotten_mask,
                crop_mold_mask,
            )
        )

        results.append({

            "food_id": food[
                "food_id"
            ],

            "class_id": food[
                "class_id"
            ],

            "class_name": food[
                "class_name"
            ],

            "confidence": food[
                "confidence"
            ],

            "bbox": food[
                "bbox"
            ],

            "crop": crop,

            "masked_food_crop": food[
                "masked_food_crop"
            ],

            "mask": food_mask,

            "instance_mask": food_mask,

            "food_mask": crop_food_mask,

            "rotten_mask": crop_rotten_mask,

            "mold_mask": crop_mold_mask,

            "rotten_mask_full": (
                rotten_overlap
            ),

            "mold_mask_full": (
                mold_overlap
            ),

            "combined_spoilage_mask": (
                crop_rotten_mask
                | crop_mold_mask
            ),

            "food_area_pixels": food_area,

            "rotten_area": rotten_area,

            "mold_area": mold_area,

            "rotten_percentage": (
                rotten_percentage
            ),

            "mold_percentage": (
                mold_percentage
            ),

            "food_mask_image": (
                food_mask_image
            ),

            "rotten_mask_image": (
                rotten_mask_image
            ),

            "mold_mask_image": (
                mold_mask_image
            ),

            "segmented_crop": (
                segmented_crop
            ),

            "segmented_image": (
                segmented_crop
            ),
        })

    return results


if __name__ == "__main__":

    print("=" * 60)
    print("SEGMENTATION MODULE TEST")
    print("=" * 60)

    MODELS.load_all()

    print()
    print(
        "Segmentation model loaded:",
        MODELS.segmentation_model is not None,
    )

    print()
    print("Segmentation classes:")

    print(
        MODELS.segmentation_model.names
    )

    print("=" * 60)
    print("SEGMENTATION MODULE READY")
    print("=" * 60)