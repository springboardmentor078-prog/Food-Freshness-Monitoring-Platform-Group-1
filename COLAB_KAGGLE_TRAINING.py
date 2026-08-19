# ==============================================================================
# GOOGLE COLAB ONE-CLICK KAGGLE YOLOV8 TRAINING SCRIPT (T4 GPU)
# ==============================================================================
# Paste your Kaggle credentials below and click RUN ▶ in Google Colab!
# ==============================================================================

import os
import sys
import glob
import json

# 👇 1. ENTER YOUR KAGGLE USERNAME AND API KEY HERE 👇
KAGGLE_USERNAME = "YOUR_KAGGLE_USERNAME"  # Replace with your Kaggle username
KAGGLE_KEY = "YOUR_KAGGLE_API_KEY"        # Replace with your Kaggle API key (32-character hex key)

# Choose Kaggle Fruit Segmentation Dataset (with polygon masks for ripe/rotten spot highlighting)
KAGGLE_DATASET = "salmaemara/fruit-freshness-and-spoilage"  # Alternative: "mbatan/fruit-ripeness-dataset"

# Model Selection: 'yolov8n-seg.pt' for pixel-level Instance Segmentation Highlighting
MODEL_NAME = "yolov8n-seg.pt"

EPOCHS = 50
IMAGE_SIZE = 640
BATCH_SIZE = 16

print("🚀 Step 1: Checking GPU & Installing Dependencies...")
!nvidia-smi

!pip install -q ultralytics kaggle pyyaml
import ultralytics
ultralytics.checks()

print("\n🔑 Step 2: Configuring Kaggle API Credentials...")
kaggle_dir = os.path.expanduser("~/.kaggle")
os.makedirs(kaggle_dir, exist_ok=True)

kaggle_json_path = os.path.join(kaggle_dir, "kaggle.json")

# Write kaggle.json programmatically from variables or uploaded file
if KAGGLE_USERNAME != "YOUR_KAGGLE_USERNAME" and KAGGLE_KEY != "YOUR_KAGGLE_API_KEY":
    with open(kaggle_json_path, "w") as f:
        json.dump({"username": KAGGLE_USERNAME, "key": KAGGLE_KEY}, f)
    os.chmod(kaggle_json_path, 0o600)
    print(f"✅ Kaggle credentials configured for user: {KAGGLE_USERNAME}")
elif os.path.exists("kaggle.json"):
    !cp kaggle.json ~/.kaggle/
    !chmod 600 ~/.kaggle/kaggle.json
    print("✅ Loaded credentials from uploaded kaggle.json file.")
else:
    print("⚠️ Please enter your KAGGLE_USERNAME and KAGGLE_KEY above or upload kaggle.json!")

print(f"\n📦 Step 3: Downloading Kaggle Dataset: {KAGGLE_DATASET}...")
os.makedirs("./dataset", exist_ok=True)
!kaggle datasets download -d {KAGGLE_DATASET} -p ./dataset --unzip

print("\n🔍 Step 4: Locating Dataset YAML Configuration...")
yaml_files = glob.glob("./dataset/**/data.yaml", recursive=True)

if not yaml_files:
    # Auto-generate data.yaml if dataset contains train/valid folders without data.yaml
    print("Generating default data.yaml for YOLO training...")
    dataset_root = os.path.abspath("./dataset")
    data_yaml_content = f"""
path: {dataset_root}
train: train/images
val: test/images
test: test/images

names:
  0: fresh
  1: spoiled
"""
    data_yaml_path = "./dataset/data.yaml"
    with open(data_yaml_path, "w") as f:
        f.write(data_yaml_content)
else:
    data_yaml_path = yaml_files[0]

print(f"✅ Active dataset configuration: {data_yaml_path}")

print(f"\n🧠 Step 5: Training YOLOv8 Model ({MODEL_NAME}) on T4 GPU...")
from ultralytics import YOLO

model = YOLO(MODEL_NAME)

results = model.train(
    data=data_yaml_path,
    epochs=EPOCHS,
    imgsz=IMAGE_SIZE,
    batch=BATCH_SIZE,
    device=0,
    project="food_freshness",
    name="kaggle_yolov8_model"
)

print("\n📊 Step 6: Validating Model Accuracy...")
metrics = model.val()
if hasattr(metrics, 'seg') and metrics.seg is not None:
    print(f"✅ Mask mAP50-95: {metrics.seg.map:.4f}")
    print(f"✅ Mask mAP50: {metrics.seg.map50:.4f}")
elif hasattr(metrics, 'box') and metrics.box is not None:
    print(f"✅ Box mAP50-95: {metrics.box.map:.4f}")

print("\n📥 Step 7: Exporting & Downloading best.pt Weight File...")
from google.colab import files

best_weights_path = "food_freshness/kaggle_yolov8_model/weights/best.pt"
if os.path.exists(best_weights_path):
    print("🎉 Training Complete! Downloading best.pt...")
    files.download(best_weights_path)
    print("\n👉 Next Step: Copy the downloaded best.pt into your project root directory:")
    print("   <your-project-folder>\\best.pt")
else:
    print("⚠️ best.pt weights file not found in output directory.")
