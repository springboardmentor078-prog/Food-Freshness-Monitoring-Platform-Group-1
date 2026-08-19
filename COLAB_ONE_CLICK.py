# ==============================================================================
# AUTOMATED COLAB CODE (PASTE YOUR ROBOFLOW API KEY BELOW)
# ==============================================================================
# 1. Get your API key from Roboflow: Export Dataset -> YOLOv8 -> Show Download Code
# 2. Paste your API Key in ROBOFLOW_API_KEY = "..." below and click RUN ▶
# ==============================================================================

import os
import glob

# 👇 PASTE YOUR ROBOFLOW API KEY HERE 👇
ROBOFLOW_API_KEY = "YOUR_ROBOFLOW_API_KEY"
WORKSPACE_NAME = "fruit-defect-detection-u5v7m"
PROJECT_NAME = "fruit-defect-detection-kgyik"
VERSION_NUMBER = 1

print("🚀 Step 1: Installing Dependencies...")
!pip install -q ultralytics roboflow

from ultralytics import YOLO
from roboflow import Roboflow

print("\n📦 Step 2: Downloading Dataset from Roboflow...")
rf = Roboflow(api_key=ROBOFLOW_API_KEY)
project = rf.workspace(WORKSPACE_NAME).project(PROJECT_NAME)
dataset = project.version(VERSION_NUMBER).download("yolov8")

# Dynamically locate data.yaml
yaml_files = glob.glob(f"{dataset.location}/**/data.yaml", recursive=True)
data_yaml_path = yaml_files[0]
print(f"\n✅ Found Dataset Configuration: {data_yaml_path}")

print("\n🧠 Step 3: Loading YOLOv8 Instance Segmentation Model (yolov8n-seg.pt)...")
model = YOLO("yolov8n-seg.pt")

print("\n🔥 Step 4: Training Segmentation Model on GPU...")
results = model.train(
    data=data_yaml_path,
    epochs=50,
    imgsz=640,
    batch=16,
    device=0,
    project="food_freshness",
    name="apple_banana_orange_seg"
)

print("\n📊 Step 5: Evaluating Segmentation Metrics...")
metrics = model.val()
print(f"✅ Mask mAP50-95: {metrics.seg.map:.4f}")

print("\n📥 Step 6: Downloading best.pt Weight File...")
from google.colab import files
best_path = "food_freshness/apple_banana_orange_seg/weights/best.pt"
if os.path.exists(best_path):
    files.download(best_path)
    print("🎉 Success! Move best.pt into your local project root folder.")
