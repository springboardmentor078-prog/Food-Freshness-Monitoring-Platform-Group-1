from ultralytics import YOLO
import cv2

class FreshnessSegmenter:
    def __init__(self, model_path="food_freshness/yolov8_seg_model/weights/best.pt"):
        """
        Initializes the YOLOv8 instance segmentation model.
        """
        self.model = YOLO(model_path)
        
    def predict(self, image_path, save_vis_path=None):
        """
        Runs inference on an image and extracts raw masks and labels.
        
        Args:
            image_path (str): Path to the input image.
            save_vis_path (str, optional): If provided, saves a visualized image with masks.
            
        Returns:
            list: A list of dictionaries, each containing:
                  - 'class_id': Integer class ID
                  - 'class_name': String class name (e.g., 'fresh' or 'spoiled')
                  - 'confidence': Float confidence score
                  - 'mask': 2D tensor containing the mask for this instance
        """
        results = self.model(image_path)
        result = results[0] # Assume single image inference
        
        extracted_data = []
        
        if result.masks is not None:
            # result.masks.data has shape (N, H, W)
            masks = result.masks.data
            boxes = result.boxes
            
            for i in range(len(masks)):
                class_id = int(boxes.cls[i].item())
                class_name = self.model.names[class_id]
                confidence = boxes.conf[i].item()
                mask = masks[i]
                
                box_2d = None
                if hasattr(boxes, 'xyxyn') and boxes.xyxyn is not None and len(boxes.xyxyn) > i:
                    b = boxes.xyxyn[i].tolist()
                    box_2d = [
                        int(round(b[1] * 1000)),
                        int(round(b[0] * 1000)),
                        int(round(b[3] * 1000)),
                        int(round(b[2] * 1000))
                    ]
                
                extracted_data.append({
                    'class_id': class_id,
                    'class_name': class_name,
                    'confidence': confidence,
                    'mask': mask,
                    'box_2d': box_2d,
                    'is_classification': False
                })
        elif hasattr(result, 'probs') and result.probs is not None:
            # Classification model support
            top1_id = int(result.probs.top1)
            top1_name = self.model.names[top1_id]
            confidence = float(result.probs.top1conf.item())
            
            extracted_data.append({
                'class_id': top1_id,
                'class_name': top1_name,
                'confidence': confidence,
                'mask': None,
                'is_classification': True
            })
                
        if save_vis_path:
            annotated_img = result.plot()
            cv2.imwrite(save_vis_path, annotated_img)
            
        return extracted_data

# Example usage (can be imported elsewhere)
if __name__ == "__main__":
    import sys
    import os
    
    # Attempt to import the new scoring module
    try:
        from scoring import FreshnessCalculator
        has_scoring = True
    except ImportError:
        has_scoring = False
    
    model_file = "food_freshness/yolov8_seg_model/weights/best.pt"
    if not os.path.exists(model_file):
        print(f"Model file {model_file} not found. Please train first.")
        sys.exit(1)
        
    segmenter = FreshnessSegmenter(model_file)
    test_image = "path/to/test.jpg"  # Update this
    
    if os.path.exists(test_image):
        data = segmenter.predict(test_image, save_vis_path="inference_debug.jpg")
        print(f"Extracted {len(data)} instances.")
        
        for item in data:
            print(f"- {item['class_name']} (conf: {item['confidence']:.2f}, mask shape: {item['mask'].shape})")
            
        if has_scoring and len(data) > 0:
            print("\n--- Calculating Freshness Score ---")
            calculator = FreshnessCalculator()
            scoring_results = calculator.calculate_score(data)
            print(f"Status: {scoring_results['status']}")
            if scoring_results['score'] is not None:
                print(f"Fresh Area: {scoring_results['fresh_area']} px")
                print(f"Spoiled Area: {scoring_results['spoiled_area']} px")
                print(f"Final Freshness Score: {scoring_results['score']}%")
    else:
        print(f"Test image {test_image} not found. Update the path to run the example.")
