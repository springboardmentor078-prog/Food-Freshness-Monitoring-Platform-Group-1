"""
Defect Detection Service — Adaptive Contrast + Dark Pixel Detection using OpenCV.
Designed specifically for dappled rot, bruising, and dark blemishes on varied fruit colors.
"""
import os
import logging
import numpy as np

logger = logging.getLogger(__name__)


class DefectDetectionService:
    """OpenCV-based visual defect detection using luminance contrast and dark-pixel isolation."""

    def detect(self, image_input, fruit_mask: np.ndarray = None, per_fruit_results: list = None) -> dict:
        """
        Detect spoilage spots using adaptive contrast thresholding and dark pixel isolation.
        """
        try:
            import cv2
        except ImportError:
            logger.warning("OpenCV not installed. Defect detection unavailable.")
            return self._empty_result(image_input)

        # Load image
        if isinstance(image_input, str):
            img = cv2.imread(image_input)
        elif isinstance(image_input, np.ndarray):
            img = image_input.copy()
        else:
            return self._empty_result(image_input)

        if img is None:
            return self._empty_result(image_input)

        h, w = img.shape[:2]

        # Prepare fruit mask
        if fruit_mask is None or fruit_mask.shape[:2] != (h, w):
            valid_mask = np.zeros((h, w), dtype=np.uint8)
            margin_x = int(w * 0.05)
            margin_y = int(h * 0.05)
            valid_mask[margin_y:h - margin_y, margin_x:w - margin_x] = 255
        else:
            kernel_erode = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
            valid_mask = cv2.erode(fruit_mask.astype(np.uint8), kernel_erode, iterations=1)

        fruit_pixel_count = max(1, int((valid_mask > 0).sum()))
        min_spot_area = max(30, int(fruit_pixel_count * 0.0005)) # Lowered min area to catch small dapples

        overlay = img.copy()
        annotated = img.copy()
        all_defects = []
        total_defect_area = 0
        claimed_mask = np.zeros((h, w), dtype=np.uint8)

        # Step 1: Convert to Grayscale for adaptive contrast analysis
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Step 2: Adaptive Thresholding (Find spots darker than local surroundings)
        # blockSize=35 means it looks at a 35x35 pixel neighborhood.
        # C=15 means a pixel must be 15 intensity units darker than the average to be marked as a defect.
        adaptive_thresh = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv2.THRESH_BINARY_INV, 35, 15
        )
        
        # Step 3: Step 3: Isolate Only Dark/Near-Black Pixels (The "Rot" Filter)
        # This grabs pure black and very dark brown spots (even faded ones)
        lower_black = np.array([0, 0, 0])
        upper_black = np.array([180, 255, 60])
        hsv_img = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        dark_mask = cv2.inRange(hsv_img, lower_black, upper_black)
        
        # Step 4: Combine Adaptive Contrast + Dark Mask
        # We take the logical AND of both masks. A spot must be DARKER than its neighbors 
        # AND roughly black/brown to be classified as rot.
        rot_candidate_mask = cv2.bitwise_and(adaptive_thresh, dark_mask)
        rot_candidate_mask = cv2.bitwise_and(rot_candidate_mask, valid_mask)
        
        # Step 5: Clean up noise
        kernel_clean = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        rot_candidate_mask = cv2.morphologyEx(rot_candidate_mask, cv2.MORPH_OPEN, kernel_clean)
        rot_candidate_mask = cv2.morphologyEx(rot_candidate_mask, cv2.MORPH_CLOSE, kernel_clean)
        rot_candidate_mask = cv2.bitwise_and(rot_candidate_mask, cv2.bitwise_not(claimed_mask))

        # Step 6: Draw Contours
        contours, _ = cv2.findContours(rot_candidate_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        for contour in contours:
            area = cv2.contourArea(contour)
            if area < min_spot_area:
                continue

            x, y, cw, ch = cv2.boundingRect(contour)
            area_pct = round((area / fruit_pixel_count) * 100, 2)
            
            # Draw solid overlay
            cv2.drawContours(overlay, [contour], -1, (0, 0, 220), -1)
            # Draw crisp red outline
            cv2.drawContours(annotated, [contour], -1, (0, 0, 255), 2)

            label_text = "Rot/Bruise"
            font_scale = max(0.35, min(0.6, w / 900))
            (tw, th), _ = cv2.getTextSize(label_text, cv2.FONT_HERSHEY_SIMPLEX, font_scale, 1)
            lbl_y = max(th + 4, y - 4)
            cv2.rectangle(annotated, (x, lbl_y - th - 4), (x + tw + 6, lbl_y + 2), (0, 0, 220), -1)
            cv2.putText(annotated, label_text, (x + 3, lbl_y - 2),
                        cv2.FONT_HERSHEY_SIMPLEX, font_scale, (255, 255, 255), 1)

            all_defects.append({
                "type": "dark_rot",
                "label": label_text,
                "severity": "critical" if area_pct > 5 else "high",
                "area_pixels": int(area),
                "area_pct": area_pct,
                "bbox": [int(x), int(y), int(x + cw), int(y + ch)],
            })
            total_defect_area += area
            cv2.drawContours(claimed_mask, [contour], -1, 255, -1)

        # Blend overlay
        alpha = 0.35
        annotated = cv2.addWeighted(overlay, alpha, annotated, 1 - alpha, 0)

        if all_defects:
            annotated = self._draw_legend(annotated, all_defects)

        defect_ratio = total_defect_area / fruit_pixel_count if fruit_pixel_count > 0 else 0.0
        summary = self._generate_summary(all_defects, defect_ratio)

        return {
            "annotated_image": annotated,
            "defects": all_defects,
            "total_defect_area": int(total_defect_area),
            "defect_ratio": round(defect_ratio, 4),
            "summary": summary,
            "rot_ratio": round(defect_ratio, 4),
        }

    def _draw_legend(self, img: np.ndarray, defects: list) -> np.ndarray:
        import cv2
        if not defects: return img
        
        seen_types = set()
        unique_defects = []
        for d in defects:
            if d["type"] not in seen_types:
                seen_types.add(d["type"])
                unique_defects.append(d)

        h, w = img.shape[:2]
        font_scale = max(0.35, min(0.5, w / 1000))
        line_height = int(20 * (font_scale / 0.4))
        padding = 8

        legend_h = len(unique_defects) * line_height + padding * 2 + line_height
        legend_w = int(180 * (font_scale / 0.4))

        x_start = w - legend_w - 10
        y_start = 10

        sub_img = img[y_start:y_start + legend_h, x_start:x_start + legend_w]
        if sub_img.shape[0] > 0 and sub_img.shape[1] > 0:
            dark_bg = np.zeros_like(sub_img)
            cv2.addWeighted(dark_bg, 0.75, sub_img, 0.25, 0, sub_img)

        cv2.putText(img, "Defects Found:", (x_start + padding, y_start + padding + int(line_height * 0.7)),
                    cv2.FONT_HERSHEY_SIMPLEX, font_scale, (255, 255, 255), 1)

        for i, d in enumerate(unique_defects):
            y_pos = y_start + padding + (i + 1) * line_height + int(line_height * 0.7)
            cv2.rectangle(img, (x_start + padding, y_pos - int(line_height * 0.5)), (x_start + padding + 12, y_pos), (0, 0, 220), -1)
            cv2.putText(img, d["label"], (x_start + padding + 18, y_pos), cv2.FONT_HERSHEY_SIMPLEX, font_scale * 0.85, (220, 220, 220), 1)
        return img

    def _generate_summary(self, defects: list, defect_ratio: float) -> str:
        if not defects:
            return "No visible spoilage spots detected. Fruit surface appears clean."
        total_pct = round(defect_ratio * 100, 1)
        return f"Detected {len(defects)} spoilage region(s) covering {total_pct}% of the fruit surface."

    @staticmethod
    def _empty_result(image_input):
        import cv2
        import numpy as np
        if isinstance(image_input, str):
            img = cv2.imread(image_input)
        elif isinstance(image_input, np.ndarray):
            img = image_input.copy()
        else:
            img = None
        return {"annotated_image": img, "defects": [], "total_defect_area": 0, "defect_ratio": 0.0, "summary": "Defect detection unavailable."}