import os
from ultralytics import YOLO

# 1. Load the newly trained AI model!
model_path = r"C:\Users\chara\runs\segment\runs\segment\fruit_seg_micro\weights\best.pt"
print(f"Loading custom trained YOLOv8 model from: {model_path}")
model = YOLO(model_path)

# 2. Pick an image from the Validation dataset to test it on
test_image = r"d:\teju\AI_Food Freshness Monitoring Platform\datasets\micro_seg\val\images\fruitseg30_apple golden delicious_1.jpg"
print(f"Testing the AI on image: {test_image}")

# 3. Ask the AI to predict where the fruit is!
print("Running prediction...")
results = model(test_image)

# 4. Save the AI's prediction image (with bounding boxes and masks drawn on it!)
output_dir = r"d:\teju\AI_Food Freshness Monitoring Platform\Image Analysis & Freshness"
for r in results:
    img_array = r.plot()  # This draws the red boxes/masks onto the image pixels
    import cv2
    output_path = os.path.join(output_dir, "AI_Prediction_Result.jpg")
    cv2.imwrite(output_path, img_array)
    print(f"\nSUCCESS! The AI's prediction has been saved to: {output_path}")
    print("Go open that image to see what the AI 'saw'!")
