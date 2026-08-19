# Google Colab Training Guide: YOLOv8 Instance Segmentation for Food Spoilage

This guide explains how to train a **YOLOv8 Instance Segmentation model (`yolov8n-seg.pt` or `yolov8m-seg.pt`)** on Google Colab using a Kaggle or Roboflow dataset to achieve pixel-accurate highlighting of rotten, moldy, or overripe regions on food produce.

---

## Why YOLOv8 Instance Segmentation?
- **Classification (`yolov8n-cls.pt`)**: Only classifies the image label (e.g., "rotten orange") without spatial location.
- **Computer Vision Thresholding**: Sensitive to lighting and reflections.
- **Instance Segmentation (`yolov8n-seg.pt`)**: Uses deep learning to output precise pixel masks and bounding coordinates (`box_2d`) targeting the exact rotten, moldy, or discolored patches on food.

---

## Step 1: Open Google Colab
1. Go to [Google Colab](https://colab.research.google.com/).
2. Create a **New Notebook**.
3. Go to **Runtime > Change runtime type** and select **T4 GPU**.

---

## Step 2: Full Google Colab Training Script

Copy and paste the code blocks below into your Colab notebook cells:

### Cell 1: Environment Setup
```python
# Check GPU availability
!nvidia-smi

# Install Ultralytics YOLOv8 and dependencies
!pip install -q ultralytics kaggle roboflow
import ultralytics
ultralytics.checks()
```

### Cell 2: Option A — Download Dataset from Kaggle
```python
import os

# Upload your kaggle.json API key
from google.colab import files
if not os.path.exists("kaggle.json"):
    print("Please upload your kaggle.json file:")
    files.upload()

!mkdir -p ~/.kaggle
!cp kaggle.json ~/.kaggle/
!chmod 600 ~/.kaggle/kaggle.json

# Download a Kaggle Food Defect / Spoilage Segmentation dataset
# Example dataset (YOLO Segmentation format):
!kaggle datasets download -d sriramr/fruits-fresh-and-rotten-dataset -p ./dataset --unzip
```

### Cell 2: Option B — Download Dataset from Roboflow (Recommended for Segmentation)
```python
from roboflow import Roboflow

# Replace with your Roboflow API key and workspace details
rf = Roboflow(api_key="YOUR_ROBOFLOW_API_KEY")
project = rf.workspace("YOUR_WORKSPACE").project("food-spoilage-segmentation")
dataset = project.version(1).download("yolov8")
```

### Cell 3: Train YOLOv8 Instance Segmentation Model
```python
from ultralytics import YOLO

# Load pre-trained YOLOv8 Nano or Medium Segmentation Model
model = YOLO("yolov8n-seg.pt") # or "yolov8m-seg.pt" for higher accuracy

# Train on GPU
results = model.train(
    data=f"{dataset.location}/data.yaml", # Path to data.yaml
    epochs=50,                           # 50-100 epochs recommended
    imgsz=640,                           # Image resolution
    batch=16,                            # Batch size
    device=0,                            # Use GPU 0
    project="food_freshness",
    name="yolov8_seg_model"
)
```

### Cell 4: Evaluate Model Accuracy (mAP Masks)
```python
# Validate trained segmentation model
metrics = model.val()
print(f"Mask mAP50-95: {metrics.seg.map:.4f}")
print(f"Mask mAP50: {metrics.seg.map50:.4f}")
```

### Cell 5: Download Trained `best.pt` Model
```python
from google.colab import files

best_weights_path = "food_freshness/yolov8_seg_model/weights/best.pt"
if os.path.exists(best_weights_path):
    print("Downloading trained weights (best.pt)...")
    files.download(best_weights_path)
else:
    print("Model weights not found. Check training output directory.")
```

---

## Step 3: Deploy `best.pt` to Your Local Project
1. Once `best.pt` downloads to your computer, copy it into your project folder:
   - `<your-project-folder>/best.pt`
2. Start/Restart your FastAPI backend:
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```
3. Your application will automatically load the new YOLOv8 segmentation weights and render pixel-perfect rotten area highlights on screen!
