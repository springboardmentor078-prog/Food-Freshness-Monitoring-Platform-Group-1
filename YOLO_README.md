# AI Food Freshness - YOLOv8 Segmentation Pipeline

This is Step 1 of the AI Food Freshness pipeline: instance segmentation of "fresh" and "spoiled" patches.

## Prerequisites

Install the required dependencies:
```bash
pip install -r requirements.txt
```

## Folder Structure (from Roboflow)
When running `train.py`, Roboflow will automatically download the dataset in YOLO format. It will create a folder structure similar to:
```
dataset_name/
├── train/
│   ├── images/
│   └── labels/
├── valid/
│   ├── images/
│   └── labels/
├── test/
│   ├── images/
│   └── labels/
└── data.yaml
```

## How to Run

### 1. Training (Colab)
You can run `train.py` directly in Google Colab or locally. 
First, edit `train.py` and update the placeholders at the top:
- `ROBOFLOW_API_KEY`
- `WORKSPACE_NAME`
- `PROJECT_NAME`
- `VERSION_NUMBER`

Then, run:
```bash
python train.py
```
This will download the dataset, initialize `yolov8n-seg.pt`, and train for the specified epochs. The best model weights will be saved to `food_freshness/yolov8_seg_model/weights/best.pt`.

### 2. Validation / Evaluation
To check validation metrics (mAP) and test inference on a sample image, edit `evaluate.py` to point to a valid `TEST_IMAGE_PATH`.

```bash
python evaluate.py
```
This script will print the mask tensor shape and save `eval_output.jpg` with the mask visual overlay.

### 3. Inference Module
The `inference.py` script provides a clean class `FreshnessSegmenter`. You can import this into your main application (e.g., your FastAPI backend) to extract raw mask tensors.

```python
from inference import FreshnessSegmenter

segmenter = FreshnessSegmenter("food_freshness/yolov8_seg_model/weights/best.pt")
results = segmenter.predict("test_image.jpg", save_vis_path="debug.jpg")

for res in results:
    print(res["class_name"], res["mask"].shape)
```
