"""
YOLOv8 Segmentation Service.
Wraps the fruit segmentation model: cycle 1 main/weights/best.pt

Purpose: Isolate individual fruit regions from an image so each can
be classified independently by the classifier service.

Returns a list of cropped fruit regions with metadata and combined fruit mask.
"""
import os
import logging
import numpy as np

logger = logging.getLogger(__name__)

# Resolve model path
MODEL_PATH = os.path.normpath(
    os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "..", "..",
        "model", "segmentation", "cycle 1 main", "weights", "best.pt"
    )
)


class SegmentationService:
    """YOLOv8s segmentation model for fruit instance isolation."""

    def __init__(self):
        self.model = None
        self._load_model()

    def _load_model(self):
        """Load the YOLOv8 segmentation model."""
        try:
            from ultralytics import YOLO
            if os.path.exists(MODEL_PATH):
                self.model = YOLO(MODEL_PATH)
                logger.info(f"Segmentation model loaded from {MODEL_PATH}")
            else:
                logger.warning(
                    f"Segmentation model not found at {MODEL_PATH}. "
                    "Will pass full image to classifier."
                )
        except ImportError:
            logger.warning(
                "ultralytics not installed. "
                "Segmentation will use fallback mode."
            )

    def segment(self, image_path: str) -> dict:
        """
        Run segmentation on a food image to isolate individual fruit regions.

        Returns:
            dict with keys:
                - crops: list[dict] — each with 'image' (ndarray), 'class_name',
                  'confidence', 'bbox', 'mask_area', 'mask_ratio', 'mask' (2D binary)
                - num_detections: int
                - total_mask_area: int
                - image_area: int
                - combined_mask: ndarray (uint8 2D binary mask of all fruits, 255 inside, 0 outside)
                - annotated_image: ndarray or None — image with masks drawn
        """
        if self.model is not None:
            try:
                return self._model_segment(image_path)
            except Exception as e:
                logger.error(f"Segmentation inference failed: {e}")
                return self._fallback_segment(image_path)
        else:
            return self._fallback_segment(image_path)

    def _model_segment(self, image_path: str) -> dict:
        """Run YOLOv8 segmentation and extract fruit crops."""
        import cv2

        results = self.model(image_path, verbose=False)
        result = results[0]
        orig_img = result.orig_img  # BGR numpy array

        h, w = orig_img.shape[:2]
        image_area = h * w

        if result.masks is None or len(result.masks) == 0:
            logger.info("No segmentation masks found — using full image.")
            return self._fallback_segment(image_path)

        masks_data = result.masks.data.cpu().numpy()
        classes = result.boxes.cls.cpu().numpy()
        confs = result.boxes.conf.cpu().numpy()
        boxes = result.boxes.xyxy.cpu().numpy()
        class_names = result.names

        crops = []
        total_mask_area = 0
        combined_mask = np.zeros((h, w), dtype=np.uint8)

        for i in range(len(masks_data)):
            mask = masks_data[i]
            cls_idx = int(classes[i])
            cls_name = class_names.get(cls_idx, f"class_{cls_idx}")
            confidence = float(confs[i])

            # Resize mask to original image size if needed
            if mask.shape[0] != h or mask.shape[1] != w:
                mask_resized = cv2.resize(
                    mask, (w, h), interpolation=cv2.INTER_NEAREST
                )
            else:
                mask_resized = mask

            # Convert to uint8 binary (0 or 255)
            binary_mask = (mask_resized > 0.5).astype(np.uint8) * 255
            combined_mask = cv2.bitwise_or(combined_mask, binary_mask)

            mask_area = int((binary_mask > 0).sum())
            total_mask_area += mask_area

            # Get bounding box for this detection
            x1, y1, x2, y2 = boxes[i].astype(int)
            # No padding - use exact model box
            x1 = max(0, x1)
            y1 = max(0, y1)
            x2 = min(w, x2)
            y2 = min(h, y2)
            # Crop the region from the original image
            crop_img = orig_img[y1:y2, x1:x2].copy()

            if crop_img.size == 0:
                continue

            crops.append({
                "image": crop_img,  # BGR numpy array
                "class_name": cls_name,
                "confidence": round(confidence, 4),
                "bbox": [int(x1), int(y1), int(x2), int(y2)],
                "mask_area": mask_area,
                "mask_ratio": round(mask_area / image_area, 4) if image_area > 0 else 0,
                "mask": binary_mask[y1:y2, x1:x2].copy(),
            })

        # Sort by area (largest first)
        crops.sort(key=lambda c: c["mask_area"], reverse=True)

        # Generate annotated image with masks drawn
        annotated = None
        try:
            annotated = result.plot()  # Returns BGR ndarray with masks/boxes
        except Exception:
            pass

        return {
            "crops": crops,
            "num_detections": len(crops),
            "total_mask_area": total_mask_area,
            "image_area": image_area,
            "combined_mask": combined_mask,
            "annotated_image": annotated,
        }

    def _fallback_segment(self, image_path: str) -> dict:
        """
        Fallback when model is unavailable.
        Returns the full image as a single "crop" and an estimated center-ellipse mask.
        """
        try:
            import cv2
            img = cv2.imread(image_path)
            if img is None:
                return {
                    "crops": [],
                    "num_detections": 0,
                    "total_mask_area": 0,
                    "image_area": 0,
                    "combined_mask": None,
                    "annotated_image": None,
                }

            h, w = img.shape[:2]
            # Create a central elliptical mask to filter out background edges/corners
            mask = np.zeros((h, w), dtype=np.uint8)
            center = (w // 2, h // 2)
            axes = (int(w * 0.42), int(h * 0.42))
            cv2.ellipse(mask, center, axes, 0, 0, 360, 255, -1)

            return {
                "crops": [{
                    "image": img,
                    "class_name": "full_image",
                    "confidence": 1.0,
                    "bbox": [0, 0, w, h],
                    "mask_area": h * w,
                    "mask_ratio": 1.0,
                    "mask": mask,
                }],
                "num_detections": 1,
                "total_mask_area": h * w,
                "image_area": h * w,
                "combined_mask": mask,
                "annotated_image": None,
            }
        except Exception:
            return {
                "crops": [],
                "num_detections": 0,
                "total_mask_area": 0,
                "image_area": 0,
                "combined_mask": None,
                "annotated_image": None,
            }
