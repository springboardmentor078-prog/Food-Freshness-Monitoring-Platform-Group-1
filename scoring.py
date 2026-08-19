import torch

class FreshnessCalculator:
    def __init__(self, fresh_class_names=["fresh"], spoiled_class_names=["spoiled"]):
        """
        Initializes the freshness calculator with class name definitions.
        By default, looks for "fresh" and "spoiled".
        """
        self.fresh_class_names = [name.lower() for name in fresh_class_names]
        self.spoiled_class_names = [name.lower() for name in spoiled_class_names]
        
    def calculate_score(self, extracted_data):
        """
        Calculates a freshness score (0-100%) based on pixel area of masks.
        
        Args:
            extracted_data (list): List of dictionaries returned by FreshnessSegmenter.predict()
                                   Each dict should have 'class_name' and 'mask' (a 2D tensor).
                                   
        Returns:
            dict: Results containing score, fresh area, spoiled area, and status.
        """
        food_counts = {}
        total_fresh_area = 0
        total_spoiled_area = 0
        spoiled_regions = []
        
        for item in extracted_data:
            class_name = item['class_name'].lower()
            
            # Substring matching for fresh/spoiled
            is_fresh = any(name in class_name for name in self.fresh_class_names)
            is_spoiled = any(name in class_name for name in self.spoiled_class_names + ["rotten", "mold", "bruise", "rot", "discoloration"])

            if is_spoiled and item.get('box_2d'):
                label = item['class_name']
                if "_" in label:
                    label = label.split("_")[0]
                spoiled_regions.append({
                    "box_2d": item['box_2d'],
                    "label": label,
                    "confidence": round(item.get('confidence', 0.9), 2)
                })

            # Handle classification models (no masks)
            if item.get('is_classification'):
                conf = item.get('confidence', 1.0)
                
                # Extract food name from class_name e.g. "rotten_orange" -> "Orange"
                detected_food = "Unknown"
                if "_" in class_name:
                    detected_food = class_name.split("_")[-1].capitalize()
                elif class_name in ["apple", "banana", "orange"]:
                    detected_food = class_name.capitalize()
                    
                # Calculate freshness percentage score based on classification confidence
                if is_fresh:
                    score = round(conf * 100, 2)
                elif is_spoiled:
                    score = round((1.0 - conf) * 100, 2)
                else:
                    score = 50.0
                    
                return {
                    "score": score,
                    "status": "Success",
                    "fresh_area": 0.0,
                    "spoiled_area": 0.0,
                    "detected_food": detected_food,
                    "spoiled_regions": spoiled_regions
                }
                
            mask = item['mask']
            if mask is None:
                continue
                
            # Mask is typically a binary tensor (or float between 0 and 1).
            # Summing all values gives the approximate pixel area.
            area = torch.sum(mask).item()
            
            if is_fresh:
                total_fresh_area += area
            elif is_spoiled:
                total_spoiled_area += area
                
            # Try to guess the food name (e.g. from 'fresh_apple' or 'rotten_orange')
            if "_" in class_name:
                food_type = class_name.split("_")[-1]
                if food_type not in food_counts:
                    food_counts[food_type] = 0
                food_counts[food_type] += area
                
        total_fruit_area = total_fresh_area + total_spoiled_area
        
        # Determine the detected food name based on which food has the largest area
        detected_food = "Unknown"
        if food_counts:
            detected_food = max(food_counts, key=food_counts.get).capitalize()
        
        # Handle edge cases
        if total_fruit_area == 0:
            return {
                "score": None,
                "status": "No fruit or relevant masks detected",
                "fresh_area": 0,
                "spoiled_area": 0,
                "detected_food": detected_food,
                "spoiled_regions": spoiled_regions
            }
            
        freshness_percentage = (total_fresh_area / total_fruit_area) * 100
        
        return {
            "score": round(freshness_percentage, 2),
            "status": "Success",
            "fresh_area": round(total_fresh_area, 2),
            "spoiled_area": round(total_spoiled_area, 2),
            "detected_food": detected_food,
            "spoiled_regions": spoiled_regions
        }
