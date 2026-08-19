# 🍎 Food Freshness Monitoring Platform

An AI-powered **Food Freshness Monitoring Platform** that analyzes food images to estimate freshness, detect spoilage, predict remaining shelf life, and provide intelligent storage recommendations.

The platform combines **Computer Vision, Deep Learning, Image Segmentation, Freshness Analysis, and Shelf-Life Prediction** with a modern web application built using React and FastAPI.

---

## 📌 Project Overview

Food wastage is a major problem caused by improper storage, delayed consumption, and difficulty in identifying food spoilage.

The **Food Freshness Monitoring Platform** provides an intelligent solution by allowing users to upload food images and receive an automated freshness analysis.

The system can:

* 📷 Analyze uploaded food images
* 🔍 Detect and segment food items
* 🦠 Identify rotten and mold-affected regions
* 📊 Calculate freshness percentage
* ⚠️ Estimate spoilage probability
* 🕒 Predict remaining shelf life
* 📅 Estimate expiry date
* 🧊 Provide storage recommendations
* 📄 Generate food freshness reports
* 📚 Maintain prediction history
* 📦 Manage food inventory

---

## 🚀 Key Features

### 1. Food Image Analysis

Users can upload an image of food through the web interface.

The AI pipeline analyzes the image and identifies the food item and possible spoilage regions.

### 2. Food Classification

The platform uses a **YOLOv8 classification model** to identify food categories and freshness conditions.

Supported categories include:

* Apple
* Banana
* Bell Pepper
* Carrot
* Cucumber
* Grape
* Guava
* Jujube
* Mango
* Orange
* Pomegranate
* Potato
* Strawberry
* Tomato

Each food category contains fresh and rotten classes.

### 3. Food Segmentation

A **YOLOv8 segmentation model** is used to identify important regions in the food image.

Segmentation classes include:

* Fruit
* Vegetable
* Rotten
* Mold

The segmentation output is used to calculate the affected area and freshness level.

### 4. Freshness Score

The system calculates a freshness percentage based on the detected food area and spoiled regions.

Example:

```text
Freshness Percentage: 87%
Rotten Area: 5%
Mold Area: 8%
```

The platform categorizes food into:

| Freshness Level  | Description                                |
| ---------------- | ------------------------------------------ |
| 🟢 Fresh         | Food is highly fresh                       |
| 🟢 Good          | Food is suitable for consumption           |
| 🟡 Acceptable    | Food should be consumed soon               |
| 🟠 Near Spoilage | Food shows significant spoilage indicators |
| 🔴 Spoiled       | Food is highly spoiled                     |

### 5. Spoilage Detection

The system detects visual spoilage indicators such as:

* Rotten regions
* Mold regions
* Discoloration
* Damaged areas

The detected regions are highlighted in the output image.

### 6. Shelf-Life Prediction

The platform predicts the remaining shelf life using information such as:

* Food category
* Freshness percentage
* Storage location
* Temperature
* Humidity
* Packaging material
* Storage duration

The predicted shelf life can also be used to estimate an expected expiry date.

### 7. Storage Recommendations

The system can provide recommendations based on the food condition and storage environment.

Examples:

* Store in refrigerator
* Keep away from moisture
* Use airtight packaging
* Consume soon
* Avoid prolonged room-temperature storage

### 8. Food Inventory Management

Users can manage their food inventory through the platform.

Inventory functionality includes:

* Add food items
* View food items
* Update food information
* Delete food items
* Track freshness
* Track predicted expiry dates

### 9. Prediction History

Previous food freshness analyses can be stored and retrieved for future reference.

### 10. PDF Report Generation

The system can generate a report containing information such as:

* Food name
* Freshness score
* Spoilage probability
* Rotten percentage
* Mold percentage
* Predicted shelf life
* Predicted expiry date
* Storage recommendation
* Analysis image

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      React.js        │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │      FastAPI         │
                    │       Backend        │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┼─────────────┐
                 │             │             │
                 ▼             ▼             ▼
          ┌────────────┐ ┌────────────┐ ┌─────────────┐
          │ AI Pipeline│ │ PostgreSQL │ │  MongoDB    │
          └─────┬──────┘ └────────────┘ └─────────────┘
                │
       ┌────────┴─────────┐
       │                  │
       ▼                  ▼
┌──────────────┐   ┌──────────────┐
│ YOLOv8       │   │ YOLOv8       │
│ Classification│   │ Segmentation │
└──────────────┘   └──────────────┘
       │                  │
       └────────┬─────────┘
                ▼
       ┌──────────────────┐
       │ Freshness Engine │
       └────────┬─────────┘
                │
                ▼
       ┌──────────────────┐
       │ Shelf-Life Model │
       └────────┬─────────┘
                │
                ▼
       ┌──────────────────┐
       │ Recommendations  │
       └──────────────────┘
```

---

# 🤖 AI Pipeline

The core image-processing pipeline follows these stages:

```text
Input Food Image
       │
       ▼
Food Detection / Segmentation
       │
       ▼
Crop Food Instances
       │
       ▼
YOLOv8 Classification
       │
       ▼
Fresh / Rotten Classification
       │
       ▼
Spoilage Segmentation
       │
       ▼
Detect Rotten + Mold Regions
       │
       ▼
Calculate Pixel Areas
       │
       ▼
Calculate Rotten Percentage
       │
       ▼
Calculate Mold Percentage
       │
       ▼
Calculate Freshness Score
       │
       ▼
Predict Shelf Life
       │
       ▼
Generate Recommendations
```

---

# 🧠 Machine Learning Models

## YOLOv8 Classification

The classification model is trained to identify fresh and rotten food categories.

### Model

```text
YOLOv8n Classification
```

### Training Configuration

```text
Image Size : 224 × 224
Batch Size : 32
Epochs     : 20
```

### Dataset

The project uses the **Freshness44 dataset** along with additional food freshness data.

The dataset contains thousands of food images covering multiple food categories and freshness conditions.

### Classification Performance

The trained classification model achieved approximately:

```text
Test Accuracy: 98.12%
```

---

## YOLOv8 Segmentation

A YOLOv8 segmentation model is used to identify:

```text
Fruit
Vegetable
Rotten
Mold
```

### Segmentation Metrics

Approximate validation performance:

```text
Precision       : 0.829
Recall          : 0.750
mAP@50          : 0.798
mAP@50-95       : 0.626

Mask Precision  : 0.670
Mask Recall     : 0.662
Mask mAP@50     : 0.568
Mask mAP@50-95  : 0.369
```

---

# 🛠️ Technology Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* JavaScript
* HTML5
* CSS3

## Backend

* Python
* FastAPI
* Uvicorn
* JWT Authentication
* REST APIs

## Database

* PostgreSQL
* MongoDB

## Artificial Intelligence

* Python
* PyTorch
* YOLOv8
* OpenCV
* Computer Vision
* Image Segmentation
* Machine Learning

## Additional Technologies

* Weather API / environmental data
* PDF generation
* Git
* GitHub

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone https://github.com/Manojrajan-lab/food-freshness-monitoring-platform.git
```

```bash
cd food-freshness-monitoring-platform
```

---

# 🖥️ Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🐍 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

### Windows

```bash
python -m venv .venv
```

Activate it:

```bash
.venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv .venv
```

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# 🔐 Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
MONGODB_URL=your_mongodb_connection_string
DATABASE_NAME=food_freshness_db

DATABASE_URL=your_postgresql_connection_string

JWT_SECRET_KEY=your_secret_key
```

> Never commit your actual `.env` file or database credentials to GitHub.

---

# ▶️ Running the Backend

From the backend directory:

```bash
uvicorn app.main:app --reload
```

The API will normally run at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 🔗 Frontend–Backend Integration

The frontend communicates with the FastAPI backend using REST APIs.

Example flow:

```text
User
 │
 ▼
React Frontend
 │
 │ POST /prediction
 ▼
FastAPI Backend
 │
 ▼
AI Prediction Pipeline
 │
 ▼
Freshness Analysis
 │
 ▼
Shelf-Life Prediction
 │
 ▼
Database
 │
 ▼
JSON Response
 │
 ▼
React Dashboard
```

---

# 📡 Example Prediction Response

```json
{
  "food_name": "Apple",
  "freshness_percentage": 87.5,
  "rotten_percentage": 7.2,
  "mold_percentage": 5.3,
  "freshness_category": "Good",
  "spoilage_probability": 0.12,
  "predicted_shelf_life": 5,
  "predicted_expiry_date": "2026-08-24"
}
```


---

# 📊 Freshness Calculation

The system uses segmentation results to estimate the amount of spoiled food.

Conceptually:

```text
Food Area = Total detected food pixels

Rotten Percentage =
(Rotten Area / Food Area) × 100

Mold Percentage =
(Mold Area / Food Area) × 100

Freshness Percentage =
100 - Rotten Percentage - Mold Percentage
```

The resulting score is used to determine the food freshness category.

---

# 📄 Report Generation

The platform generates a food freshness analysis report containing the AI prediction results.

A typical report contains:

```text
Food Freshness Analysis Report
│
├── Food Name
├── Analysis Date
├── Freshness Score
├── Freshness Category
├── Rotten Percentage
├── Mold Percentage
├── Spoilage Probability
├── Predicted Shelf Life
├── Predicted Expiry Date
├── Storage Recommendation
└── Analysis Image
```

---

# 📈 Future Enhancements

The project can be extended with:

* IoT temperature and humidity sensors
* Real-time environmental monitoring
* Improved shelf-life prediction
* More food categories
* Mobile application
* Cloud deployment
* Real-time notifications
* Email alerts before predicted expiry
* Advanced recommendation engine
* Improved segmentation accuracy
* Explainable AI using Grad-CAM
* Automated inventory expiry alerts

---

# 👨‍💻 Team

**Food Freshness Monitoring Platform — Group 3**

The project combines contributions across:

* AI/ML Development
* Frontend Development
* Backend Development
* Report Generation

---

# 🎯 Project Goal

The primary goal of this project is to develop an intelligent system capable of helping users **reduce food wastage by automatically monitoring food freshness, detecting spoilage, predicting shelf life, and providing actionable storage recommendations.**

---

## ⭐ Acknowledgements

* YOLO / Ultralytics
* Freshness44 Dataset
* OpenCV
* FastAPI
* React.js
* PyTorch
* PostgreSQL
* MongoDB
* Vite
* Tailwind CSS
