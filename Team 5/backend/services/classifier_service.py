"""
YOLOv8 Classification Service.
Wraps the freshness classifier model: updated_freshness_v3_yolov8n_cls (1).pt

Accepts both file paths and numpy arrays (cropped regions from segmentation).
Returns predicted class (e.g. 'Apple_Fresh', 'Banana_Rotten') and confidence.
"""
import os
import logging
import numpy as np

logger = logging.getLogger(__name__)

# Resolve model path relative to project root
MODEL_PATH = os.path.normpath(
    os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "..", "..",
        "model", "classification",
        "updated_freshness_v3_yolov8n_cls (1).pt"
    )
)


class ClassifierService:
    """YOLOv8 nano classification model for food freshness detection."""

    def __init__(self):
        self.model = None
        self._load_model()

    def _load_model(self):
        """Load the YOLOv8 classification model."""
        try:
            from ultralytics import YOLO
            if os.path.exists(MODEL_PATH):
                self.model = YOLO(MODEL_PATH)
                logger.info(f"Classifier model loaded from {MODEL_PATH}")
            else:
                logger.warning(
                    f"Classifier model not found at {MODEL_PATH}. "
                    "Will use fallback predictions."
                )
        except ImportError:
            logger.warning(
                "ultralytics not installed. "
                "Classifier will use fallback mode."
            )

    def predict(self, image_input) -> dict:
        """
        Run classification inference on a food image.

        Args:
            image_input: str (file path) OR numpy ndarray (BGR crop from segmentation)

        Returns:
            dict with keys:
                - predicted_class: str (e.g. 'Apple_Fresh')
                - confidence: float (0.0 - 1.0)
                - is_fresh: bool
                - all_probs: dict (top 5 class probabilities)
        """
        if self.model is not None:
            try:
                results = self.model(image_input, verbose=False)
                result = results[0]

                # Get top prediction
                probs = result.probs
                top_class_idx = probs.top1
                top_class_name = result.names[top_class_idx]
                confidence = float(probs.top1conf)

                # Determine freshness from class name
                name_lower = top_class_name.lower()
                is_fresh = "fresh" in name_lower and "not" not in name_lower

                # Get top 5 probabilities for detailed results
                top5_indices = probs.top5
                top5_confs = probs.top5conf.cpu().numpy()
                all_probs = {}
                for idx, conf in zip(top5_indices, top5_confs):
                    all_probs[result.names[idx]] = round(float(conf), 4)

                return {
                    "predicted_class": top_class_name,
                    "confidence": confidence,
                    "is_fresh": is_fresh,
                    "all_probs": all_probs,
                }

            except Exception as e:
                logger.error(f"Classification inference failed: {e}")
                return self._fallback_prediction(image_input)
        else:
            return self._fallback_prediction(image_input)

    def predict_batch(self, crops: list) -> list:
        """
        Classify multiple cropped regions from segmentation.

        Args:
            crops: list of numpy arrays (BGR images)

        Returns:
            list of prediction dicts (same format as predict())
        """
        results = []
        for crop in crops:
            results.append(self.predict(crop))
        return results

    def _fallback_prediction(self, image_input) -> dict:
        """
        Fallback when model is unavailable.
        Uses basic image analysis heuristics.
        """
        try:
            import cv2

            if isinstance(image_input, str):
                img = cv2.imread(image_input)
            elif isinstance(image_input, np.ndarray):
                img = image_input
            else:
                img = None

            if img is None:
                return {
                    "predicted_class": "Unknown",
                    "confidence": 0.5,
                    "is_fresh": True,
                    "all_probs": {"Unknown": 0.5},
                }

            # Simple color-based freshness heuristic
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            # Fresh foods tend to have higher saturation and value
            avg_saturation = float(np.mean(hsv[:, :, 1]))
            avg_value = float(np.mean(hsv[:, :, 2]))

            # Normalize to 0-1 range
            freshness_indicator = (avg_saturation / 255.0 + avg_value / 255.0) / 2
            is_fresh = freshness_indicator > 0.35

            return {
                "predicted_class": "Food_Fresh" if is_fresh else "Food_Rotten",
                "confidence": min(0.95, max(0.5, freshness_indicator)),
                "is_fresh": is_fresh,
                "all_probs": {
                    "Food_Fresh" if is_fresh else "Food_Rotten":
                        min(0.95, max(0.5, freshness_indicator))
                },
            }

        except Exception:
            return {
                "predicted_class": "Food_Fresh",
                "confidence": 0.5,
                "is_fresh": True,
                "all_probs": {"Food_Fresh": 0.5},
            }
