from ultralytics import YOLO
import cv2
import os

# ==========================================
# CONFIGURATION
# ==========================================
MODEL_PATH = "food_freshness/yolov8_seg_model/weights/best.pt"
TEST_IMAGE_PATH = "path/to/your/test/image.jpg" # Update this to an actual image path
OUTPUT_IMAGE_PATH = "eval_output.jpg"

def main():
    if not os.path.exists(MODEL_PATH):
        print(f"Error: Model not found at {MODEL_PATH}")
        print("Please train the model first or update the path.")
        return

    # Load the best trained model
    print(f"Loading trained model from {MODEL_PATH}...")
    model = YOLO(MODEL_PATH)

    # 1. Evaluate on Validation Set
    print("\n--- Running Validation ---")
    # You can specify data="path/to/data.yaml" if you want to explicitly validate against a dataset
    metrics = model.val()
    print(f"mAP50-95 (masks): {metrics.seg.map:.4f}")
    
    if not os.path.exists(TEST_IMAGE_PATH):
        print(f"\nWarning: Test image not found at {TEST_IMAGE_PATH}. Skipping inference test.")
        return

    # 2. Test Inference on a Sample Image
    print("\n--- Running Inference Test ---")
    results = model.predict(source=TEST_IMAGE_PATH, save=False)
    
    result = results[0] # Get the first result
    
    if result.masks is not None:
        mask_data = result.masks.data
        print(f"Mask tensor shape: {mask_data.shape} (N_masks, Height, Width)")
        print(f"Detected {len(mask_data)} instance(s).")
    else:
        print("No masks detected in the test image.")
        
    # Save a visual copy for debugging
    annotated_img = result.plot()
    cv2.imwrite(OUTPUT_IMAGE_PATH, annotated_img)
    print(f"Saved inference visualization to {OUTPUT_IMAGE_PATH}")

if __name__ == "__main__":
    main()
