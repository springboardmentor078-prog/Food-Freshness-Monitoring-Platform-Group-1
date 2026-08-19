# Step-by-Step Guide: YOLOv8 Food Spoilage Training on Google Colab (T4 GPU) using Kaggle

This guide walks you through training your custom **YOLOv8** (Segmentation or Detection) model on a **Google Colab T4 GPU** using a **Kaggle dataset**, exporting `best.pt`, and plugging it into your AI Food Freshness project.

---

## 🔑 Prerequisites: Get Your Kaggle API Credentials

1. Log into your account on [Kaggle](https://www.kaggle.com).
2. Click on your profile picture in the top right corner and go to **Settings**.
3. Scroll down to the **API** section.
4. Click **Create New Token**. This downloads a file named `kaggle.json`.
5. Open `kaggle.json` in any text editor. It contains:
   ```json
   {
     "username": "your_kaggle_username",
     "key": "1234567890abcdef1234567890abcdef"
   }
   ```

---

## 🚀 Step 1: Set Up Google Colab with T4 GPU

1. Open [Google Colab](https://colab.research.google.com/).
2. Click **New Notebook**.
3. Go to top menu: **Runtime > Change runtime type**.
4. Set Hardware accelerator to **T4 GPU** and click **Save**.

---

## ⚡ Step 2: Run One-Click Kaggle Training Script

Copy and paste the script from `COLAB_KAGGLE_TRAINING.py` into your Colab cell.

### Enter Your Credentials at the top of the cell:
```python
KAGGLE_USERNAME = "your_kaggle_username"  # Replace with your username
KAGGLE_KEY = "1234567890abcdef..."        # Replace with your API key
KAGGLE_DATASET = "sriramr/fruits-fresh-and-rotten-dataset"  # Dataset slug
```

Then click **Run ▶**.

The script will automatically:
1. Enable T4 GPU hardware acceleration.
2. Install `ultralytics` and `kaggle` libraries.
3. Authenticate with Kaggle API using your credentials.
4. Download and extract the food freshness dataset.
5. Train YOLOv8 (`yolov8n-seg.pt` or `yolov8n.pt`) for 50 epochs.
6. Evaluate mask & bounding box mAP accuracy metrics.
7. Automatically download `best.pt` directly to your browser!

---

## 📂 Step 3: Deploy `best.pt` to Your Project

1. Move the downloaded `best.pt` file into your local project root:
   ```
   <your-project-folder>/best.pt
   ```
2. Start or restart your backend API server:
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```
3. Test your spoiled region detector via CLI or API:
   ```bash
   python spoil_detector.py --image path/to/sample_fruit.jpg
   ```

---

## 🛠️ Configuration & Weight Swapping

You can swap weights anytime without touching code by:
1. Placing new `.pt` weights in the project root as `best.pt`.
2. Or setting the environment variable `YOLO_MODEL_PATH`:
   ```bash
   set YOLO_MODEL_PATH=C:\path\to\your_new_weights.pt
   uvicorn backend.main:app --reload
   ```
