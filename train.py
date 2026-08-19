import os
from ultralytics import YOLO
from roboflow import Roboflow

# ==========================================
# CONFIGURATION & PLACEHOLDERS
# ==========================================
ROBOFLOW_API_KEY = "YOUR_ROBOFLOW_API_KEY"
WORKSPACE_NAME = "YOUR_WORKSPACE_NAME"
PROJECT_NAME = "YOUR_PROJECT_NAME"
VERSION_NUMBER = 1 # Your dataset version

# Training Hyperparameters
EPOCHS = 50
IMGSZ = 640
BATCH_SIZE = 16
MODEL_NAME = "yolov8n-seg.pt"  # Nano instance segmentation model

# ==========================================
# 1. DOWNLOAD DATASET FROM ROBOFLOW
# ==========================================
print("Downloading dataset from Roboflow...")
rf = Roboflow(api_key=ROBOFLOW_API_KEY)
project = rf.workspace(WORKSPACE_NAME).project(PROJECT_NAME)
dataset = project.version(VERSION_NUMBER).download("yolov8")

# ==========================================
# 2. LOAD MODEL & TRAIN
# ==========================================
print("Loading YOLOv8 segmentation model...")
model = YOLO(MODEL_NAME) 

print("Starting training...")
results = model.train(
    data=f"{dataset.location}/data.yaml",
    epochs=EPOCHS,
    imgsz=IMGSZ,
    batch=BATCH_SIZE,
    project="food_freshness",
    name="yolov8_seg_model"
)

print("Training complete! Best model saved to food_freshness/yolov8_seg_model/weights/best.pt")
