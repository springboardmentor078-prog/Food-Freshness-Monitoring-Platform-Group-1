"""
Master AI Service — Professional Full-Image Rot Analysis.
Supports multiple fruits side-by-side, overlapping duplicate removal, and multi-color bounding boxes.
"""
import os
import logging
import base64
import cv2
import numpy as np
from datetime import date, datetime
from ultralytics import YOLO

logger = logging.getLogger(__name__)

MODEL_VERSION = "yolov8n_professional_v1"


class AIService:
    """
    Singleton AI Service executing Bounding-Box-Aware Rot Analysis.
    """

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self._initialized = True

        logger.info("Initializing Professional AI Service — loading YOLOv8n...")
        model_path = os.path.normpath(
            os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "yolov8n.pt")
        )
        if not os.path.exists(model_path):
            model_path = "yolov8n.pt"

        try:
            self.model = YOLO(model_path)
            logger.info("YOLOv8n loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load YOLOv8n model: {e}")
            self.model = None

    def analyze(
        self,
        image_path: str,
        produce_type: str = "Fruit",
        temperature_c: float = 4.0,
        humidity_pct: float = 90.0,
        storage_area: str = "fridge",
        packaging_material: str = "unpackaged",
        purchase_date: date = None
    ) -> dict:
        """
        Run Professional Bounding-Box-Only Inspection Pipeline.
        """
        logger.info(f"═══ Professional Pipeline for: {image_path} ═══")

        img = cv2.imread(image_path)
        if img is None:
            raise ValueError(f"Could not read image at path: {image_path}")

        h, w = img.shape[:2]
        annotated_img = img.copy()

        # ================================================================
        # STEP 1: YOLO DETECTION
        # ================================================================
        raw_detections = []
        if self.model is not None:
            results = self.model(img, verbose=False)
            for res in results:
                for box in res.boxes:
                    cls_id = int(box.cls[0])
                    cls_name = self.model.names.get(cls_id, "").lower()
                    conf = float(box.conf[0])

                    if conf >= 0.20:
                        x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                        x1, y1 = max(0, x1), max(0, y1)
                        x2, y2 = min(w, x2), min(h, y2)
                        
                        if (x2 - x1) > 20 and (y2 - y1) > 20:
                            raw_detections.append({
                                "class": cls_name,
                                "conf": conf,
                                "box": (x1, y1, x2, y2)
                            })

        # ================================================================
        # STEP 1.5: NON-MAXIMUM SUPPRESSION (Kill overlapping boxes!)
        # ================================================================
        raw_detections.sort(key=lambda x: x["conf"], reverse=True)
        
        final_detections = []
        while raw_detections:
            best = raw_detections.pop(0)
            final_detections.append(best)
            
            best_box = best["box"]
            best_x1, best_y1, best_x2, best_y2 = best_box
            best_area = (best_x2 - best_x1) * (best_y2 - best_y1)
            
            raw_detections = [
                det for det in raw_detections
                if not self._iou(best_box, det["box"]) > 0.5
            ]

        # ================================================================
        # STEP 2: DRAW BOUNDING BOXES (MULTI-COLOR SUPPORT)
        # ================================================================
        # Define colors for multiple fruit types
        COLORS = [
            (0, 255, 0),    # Green
            (255, 165, 0),  # Orange
            (0, 0, 255),    # Red
            (255, 255, 0),  # Yellow
        ]
        
        detected_classes = []
        fruit_boxes = []

        for idx, det in enumerate(final_detections):
            x1, y1, x2, y2 = det["box"]
            fruit_boxes.append((x1, y1, x2, y2))
            detected_classes.append(det["class"].capitalize())

            # Pick a color based on index (cycles if more than 4 fruits)
            color = COLORS[idx % len(COLORS)]

            cv2.rectangle(annotated_img, (x1, y1), (x2, y2), color, 3)
            label_text = f"{det['class'].capitalize()} ({int(det['conf'] * 100)}%)"
            cv2.putText(
                annotated_img, label_text, (x1, max(y1 - 10, 20)),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2, cv2.LINE_AA
            )

        # ================================================================
        # STEP 3: CALCULATE ROT ONLY INSIDE BOUNDING BOXES (IGNORE SHADOWS)
        # ================================================================
        hsv_img = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        
        # Universal Brown + Black Rot Range
        lower_brown = np.array([0, 10, 20], dtype=np.uint8)
        upper_brown = np.array([30, 255, 200], dtype=np.uint8)
        lower_black = np.array([0, 0, 0], dtype=np.uint8)
        upper_black = np.array([180, 255, 65], dtype=np.uint8)

        brown_mask = cv2.inRange(hsv_img, lower_brown, upper_brown)
        black_mask = cv2.inRange(hsv_img, lower_black, upper_black)
        global_rot_mask = cv2.bitwise_or(brown_mask, black_mask)

        # Create a combined mask for ONLY the fruit areas
        fruit_area_mask = np.zeros((h, w), dtype=np.uint8)
        for (x1, y1, x2, y2) in fruit_boxes:
            # Ignore the bottom 10% of each box to avoid shadows
            ignore_bottom = int((y2 - y1) * 0.10)
            y2_adj = y2 - ignore_bottom
            fruit_area_mask[y1:y2_adj, x1:x2] = 255

        # Apply fruit mask to rot mask (Ignore background!)
        final_rot_mask = cv2.bitwise_and(global_rot_mask, fruit_area_mask)

        # Clean up noise
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        final_rot_mask = cv2.morphologyEx(final_rot_mask, cv2.MORPH_OPEN, kernel)
        final_rot_mask = cv2.dilate(final_rot_mask, kernel, iterations=2)

        # Count pixels correctly
        total_fruit_pixels = cv2.countNonZero(fruit_area_mask)
        total_rot_pixels = cv2.countNonZero(final_rot_mask)

        # Calculate accurate rot_percentage
        if total_fruit_pixels > 0:
            rot_percentage = round((total_rot_pixels / total_fruit_pixels) * 100, 2)
        else:
            rot_percentage = 0.0

        # Draw Red contours on the final image
        contours, _ = cv2.findContours(final_rot_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        for cnt in contours:
            if cv2.contourArea(cnt) >= 15:
                cv2.drawContours(annotated_img, [cnt], -1, (0, 0, 255), 2)

        # ================================================================
        # STEP 4: DYNAMIC SHELF-LIFE & SCORING CALCULATION
        # ================================================================
        freshness_score = round(max(0, 100 - rot_percentage), 1)
        spoilage_prob = round(min(1.0, rot_percentage / 100), 3)

        if rot_percentage <= 2:
            remaining_days = round(7.0, 1)
            freshness_label = "Fresh"
        elif rot_percentage <= 10:
            remaining_days = round(5.0 - (rot_percentage * 0.2), 1)
            freshness_label = "Good"
        elif rot_percentage <= 25:
            remaining_days = round(3.0 - (rot_percentage * 0.06), 1)
            freshness_label = "Acceptable"
        elif rot_percentage <= 50:
            remaining_days = round(1.5 - (rot_percentage * 0.02), 1)
            freshness_label = "Near Spoilage"
        else:
            remaining_days = 0.0
            freshness_label = "Rotten"

        if remaining_days < 0:
            remaining_days = 0.0

        # ================================================================
        # STEP 5: FRONTEND CLASS LABEL MAPPING (PROFESSIONAL EDITION)
        # ================================================================
        if len(detected_classes) == 0:
            predicted_class = produce_type.capitalize() if produce_type else "Fruit"
        else:
            unique_fruits = list(set(detected_classes))
            if len(unique_fruits) == 1:
                predicted_class = unique_fruits[0]  # Multiple bananas show "Banana"
            elif len(unique_fruits) > 1:
                predicted_class = "Mixed/Multiple Fruit"  # Banana + Apple shows "Mixed"
            else:
                predicted_class = unique_fruits[0]

        # ================================================================
        # STEP 6: ENCODE BASE64 IMAGE OUTPUT
        # ================================================================
        _, buffer = cv2.imencode('.jpg', annotated_img)
        base64_str = base64.b64encode(buffer).decode('utf-8')
        annotated_image_base64 = f"data:image/jpeg;base64,{base64_str}"

        # ================================================================
        # STEP 7: INTELLIGENT RECOMMENDATIONS
        # ================================================================
        recommendations = []
        if freshness_label == "Fresh":
            recommendations.append({
                "type": "info",
                "title": "Optimal Freshness",
                "message": f"No significant rot detected ({rot_percentage}%). Store properly for maximum shelf life."
            })
        elif freshness_label == "Good":
            recommendations.append({
                "type": "info",
                "title": "Minor Spoilage",
                "message": f"{rot_percentage}% rot detected. Consume within the next {remaining_days} days."
            })
        elif freshness_label == "Acceptable":
            recommendations.append({
                "type": "warning",
                "title": "Spoilage Detected",
                "message": f"{rot_percentage}% rot detected. Discard severely damaged portions and eat soon."
            })
        elif freshness_label == "Near Spoilage":
            recommendations.append({
                "type": "critical",
                "title": "Severe Spoilage Warning",
                "message": f"{rot_percentage}% rot detected. Fruit is nearing expiration. Please consume immediately."
            })
        else:
            recommendations.append({
                "type": "critical",
                "title": "Rotten / Inedible",
                "message": f"{rot_percentage}% rot detected. This food is heavily spoiled and should be discarded immediately."
            })

        logger.info(f"  → Rot: {rot_percentage}%, Status: '{freshness_label}', Score: {freshness_score}, Class: '{predicted_class}'")

        return {
            "predicted_class": predicted_class,
            "freshness_label": freshness_label,
            "freshness_score": freshness_score,
            "remaining_shelf_life": remaining_days,
            "spoilage_probability": spoilage_prob,
            "model_version": MODEL_VERSION,
            "annotated_image": annotated_image_base64,
            "status": freshness_label,
            "shelf_life": f"{remaining_days} Days",
            "rot_percentage": rot_percentage,
            "extra": {
                "annotated_image": annotated_image_base64,
                "status": freshness_label,
                "shelf_life": f"{remaining_days} Days",
                "rot_percentage": rot_percentage,
                "num_fruits_detected": len(fruit_boxes),
                "recommendations": recommendations,
            }
        }

    # ================================================================
    # HELPER: Calculate Intersection over Union (IoU) for NMS
    # ================================================================
    def _iou(self, box1, box2):
        """Calculate Intersection over Union (IoU) of two bounding boxes."""
        x1_1, y1_1, x2_1, y2_1 = box1
        x1_2, y1_2, x2_2, y2_2 = box2

        xi1 = max(x1_1, x1_2)
        yi1 = max(y1_1, y1_2)
        xi2 = min(x2_1, x2_2)
        yi2 = min(y2_1, y2_2)

        inter_area = max(0, xi2 - xi1) * max(0, yi2 - yi1)
        box1_area = (x2_1 - x1_1) * (y2_1 - y1_1)
        box2_area = (x2_2 - x1_2) * (y2_2 - y2_1)
        union_area = box1_area + box2_area - inter_area

        if union_area == 0:
            return 0
        return inter_area / union_area