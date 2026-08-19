# FOOD MONITORING PLATFORM
## Project Documentation – Milestone 3
### AI-Based Food Freshness Detection, Scoring, Classification and Full-Stack Management System ("FreshTrack")
**Repository:** food-monitoring-platform-batch2  
**Date:** 11 August 2026  

---

## 1. Abstract
The **Food Monitoring Platform** ("FreshTrack") is an enterprise-grade, AI-powered food quality management system designed to detect produce freshness, quantify surface spoilage, predict remaining shelf life, and manage food inventory. Building upon the foundational detection capabilities of Milestone 1 and the authentication and pixel-scoring mechanisms of Milestone 2, **Milestone 3** delivers a complete full-stack web application ecosystem.

Key advancements in Milestone 3 include:
1. **Full-Stack Next.js 16 (React 19) Web Application:** A responsive web application ("FreshTrack") equipped with dark/light themes, modern design systems, and protected user portals.
2. **Multi-Engine AI Inference Pipeline:** A resilient 3-tier fallback chain incorporating **Gemini 1.5 Flash Vision AI**, **YOLOv8 Instance Segmentation & Object Detection (`best.pt` / `best.onnx`)**, and **OpenCV HSV/LAB Computer Vision Spot Detection**.
3. **Dual Visual Highlighting Engine:** Server-side OpenCV semi-transparent overlay blending paired with client-side dynamic, animated CSS bounding box overlays (`SpoiledRegionOverlay.tsx`) for localized defect visual rendering.
4. **Knowledge-Base Driven Rules Engine:** Item-specific shelf-life estimation and customized storage recommendations tailored to produce categories (Apples, Tomatoes, Bananas, Potatoes, Capsicums, Oranges) via `shelfLifeRules.json`.
5. **Real-Time Analytics & Inventory Management Hub:** Firebase Firestore-backed dashboard featuring `Recharts` data visualization, active inventory tracking, smart spoilage alerts, complete historical scan logging, and food waste reduction insights.
6. **ONNX Export, Client PDF Auditing & Docker Containerization:** Optimized ONNX model export for edge execution, client-side PDF export (`jspdf`), and containerized deployment configuration (`Dockerfile` for Hugging Face Spaces and cloud servers).

---

## 2. Introduction
Food spoilage poses severe challenges across the supply chain, retail inventory management, and household food security. Manual visual inspection is subjective, error-prone, and inconsistent. Automated computer vision and machine learning offer standardized, instantaneous assessment of food quality.

### Evolution Across Project Milestones:
* **Milestone 1:** Introduced the baseline YOLOv8 model for food classification and localized defect detection, exposed through a simple FastAPI endpoint.
* **Milestone 2:** Secured access with Firebase Authentication (Email/Password & Google Sign-In) and introduced quantitative scoring (0–100) based on surface damaged pixel proportions, alongside tiered bracket shelf-life mapping.
* **Milestone 3:** Transforms the API into an enterprise food management platform ("FreshTrack"). Milestone 3 adds a full-stack Next.js frontend, multi-engine model fallback chain (Gemini 1.5 Flash + YOLOv8 + OpenCV), dynamic per-food storage rules, interactive analytics dashboards, active inventory management, real-time alerts, ONNX deployment, and Docker containerization.

---

## 3. Objectives
* **To construct a production-ready Next.js 16 full-stack web interface** ("FreshTrack") supporting dark/light mode themes, protected routes, and interactive dashboards.
* **To implement a resilient 3-tier AI inference pipeline** (Gemini 1.5 Flash Vision API $\rightarrow$ YOLOv8 Instance Segmentation $\rightarrow$ OpenCV Computer Vision Spot Locator).
* **To provide dual visual defective region highlighting**, generating server-side OpenCV BGR blended images and client-side animated bounding box overlays with normalized coordinates.
* **To implement an item-specific rules engine** (`shelfLifeRules.json` + `rules.py`) replacing generic bracket mappings with tailored shelf-life ranges and storage advice for specific produce types.
* **To deliver a real-time analytics hub and inventory manager** with Firestore database integration, Recharts metrics, active inventory tracking, smart expiration alerts, and financial waste savings calculators.
* **To enable cross-platform cloud deployment** through ONNX model conversion, client PDF report generation, and Linux Docker containerization (`Dockerfile` configured for port 7860).

---

## 4. System Requirements

### 4.1 Hardware Requirements
* **Inference Runtime:** Modern Multi-Core CPU (Intel i5/i7/Ryzen 5+) or CUDA-capable NVIDIA GPU (GTX 1660 / RTX Series) for real-time model inference.
* **Memory:** Minimum 8 GB RAM (16 GB recommended for concurrent video stream / image batch handling).
* **Storage:** 5 GB available disk space for model weights (`best.pt`, `best.onnx`), datasets, and web builds.
* **Training Runtime:** Google Colab Cloud T4/A100 GPU for YOLOv8 model training.

### 4.2 Software & Dependency Stack
* **Frontend Technologies:**
  * **Framework:** Next.js 16.2 (App Router), React 19.2, TypeScript 5
  * **Styling:** Tailwind CSS v4, `@base-ui/react`, Framer Motion, Lucide Icons, `next-themes`
  * **Visualization & Export:** Recharts 3.9, `jspdf` 4.2
  * **Authentication & Database:** Firebase Auth 12.16, Firebase Firestore
* **Backend Technologies:**
  * **Framework:** FastAPI 0.115, Uvicorn 0.34, Python-Multipart
  * **Machine Learning & Computer Vision:** PyTorch 2.5, Ultralytics YOLOv8 8.3, OpenCV (opencv-python), Pillow 11.1, NumPy
* **Cloud & Model Tools:**
  * **Model Formats:** PyTorch (`.pt`), ONNX (`.onnx`)
  * **Deployment:** Docker (Python 3.9-slim), Hugging Face Spaces (Port 7860)
  * **Cloud Training:** KaggleHub API, Google Colab runtime scripts

---

## 5. System Architecture & Methodology

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT LAYER                                      |
|  Next.js 16 Web App (FreshTrack) | User Auth (Firebase) | Responsive UI (Tailwind) |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                                FASTAPI BACKEND                                    |
|   /predict Endpoint  |  /detect-spoilage Endpoint  | Auth & Payload Processing   |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                        MULTI-ENGINE AI INFERENCE PIPELINE                         |
|                                                                                   |
|  [Engine 1: Gemini 1.5 Flash] ----(If Key Active)-----> Cloud Multi-Modal AI       |
|             |                                                                     |
|      (Fallback / Offline)                                                         |
|             v                                                                     |
|  [Engine 2: YOLOv8 Segmentation] --(best.pt / best.onnx)-> Pixel & BBox Detector  |
|             |                                                                     |
|      (Uncertain / Spoilage Confirmed)                                             |
|             v                                                                     |
|  [Engine 3: OpenCV CV Detector] --(HSV/LAB Color)---------> Spot & Contour Finder |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                       SCORING & RULES RECOMMENDATION LOGIC                        |
|   Freshness Score Calculation  |  shelfLifeRules.json  | Per-Food Storage Guidance|
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                     DATA VISUALIZATION & OUTPUT DELIVERY                          |
|  OpenCV Base64 Overlays | Dynamic CSS BBox Overlay | Firestore Logging & Dashboard  |
+-----------------------------------------------------------------------------------+
```

### 5.1 Multi-Engine Fallback Chain
1. **Engine 1: Gemini 1.5 Flash Vision API (`analyze_with_gemini`):** Invoked when `GEMINI_API_KEY` is present. Analyzes complex multi-modal visual features and returns normalized bounding box coordinates (`box_2d`), confidence scores, and storage recommendations.
2. **Engine 2: YOLOv8 Instance Segmentation & Classification (`SpoilDetector`):** Loads local PyTorch weights (`best.pt`) or ONNX runtime (`best.onnx`). Detects exact polygon contours, bounding boxes, and object classes (`fresh_apple`, `rotten_orange`, etc.).
3. **Engine 3: OpenCV Computer Vision Spot Locator (`detect_spoiled_patches_cv`):** Runs color-space segmentation (HSV/LAB channels) to detect discolored spots, mold patches, and surface blemishes when YOLOv8 detects spoilage or operates in combined mode.

### 5.2 Dynamic Scoring & Knowledge-Base Rules Engine
* **Freshness Score Calculation:**
  $$\text{Freshness Score} = \text{max}\left(0, 100 - \sum (\text{Region Confidence} \times \text{Penalty Weight})\right)$$
  For classification models:
  $$\text{Score (Fresh)} = \text{Confidence} \times 100 \quad \mid \quad \text{Score (Spoiled)} = (1.0 - \text{Confidence}) \times 100$$
* **Item-Specific Rules Engine (`rules.py` + `shelfLifeRules.json`):** Matches detected food categories (e.g., Apple, Tomato, Banana, Potato, Capsicum, Orange) and freshness categories (`fresh`, `moderate`, `spoiled`) against a structured JSON database to output item-tailored remaining shelf-life ranges and storage instructions.

---

## 6. Implementation Details

### 6.1 Backend API & Services Architecture
* **`backend/main.py`:** Initializes the FastAPI application, configures CORS middleware for frontend communication, and attaches routing endpoints.
* **`backend/api/routes/predict.py`:** Implements `/predict` and `/detect-spoilage` endpoints, receiving multipart image uploads, executing inference, applying shelf-life rules, and returning JSON responses.
* **`backend/services/inference.py`:** Manages the 3-engine fallback chain, coordinating Gemini, YOLOv8, and OpenCV detectors while computing freshness category metrics.
* **`backend/services/spoil_detector.py`:** Implements the `SpoilDetector` class for YOLOv8 model loading, dynamic model reloading (`reload_model`), bounding box normalization (0–1000 range), and server-side OpenCV BGR overlay blending (`cv2.addWeighted`).
* **`backend/services/cv_detector.py`:** Provides standalone OpenCV HSV/LAB color thresholding and contour detection for localized spoilage spot detection.
* **`backend/services/rules.py`:** Parses `data/shelfLifeRules.json` and supplies fallback recommendations based on freshness classification.

### 6.2 Frontend Architecture ("FreshTrack")
* **Landing Page (`app/page.tsx`):** Features hero branding, step-by-step walkthroughs, feature grids, and call-to-action buttons.
* **Protected App Router (`app/(protected)/layout.tsx`):** Secures application portals with Firebase authentication session checks.
* **Dashboard (`app/(protected)/dashboard/page.tsx`):** Displays real-time scan statistics, fresh/moderate/spoiled count cards, average confidence metrics, interactive `Recharts` bar distributions, and recent scan logs.
* **Upload & Analysis Gateway (`app/(protected)/upload/page.tsx`):** Drag-and-drop image upload supporting custom food labels and model execution modes ("fallback" vs "combined").
* **Results Visualizer (`app/(protected)/result/page.tsx`):** Renders item metrics, freshness badges, storage recommendations, server-blended image views, and client-side animated overlays.
* **Inventory Management (`app/(protected)/inventory/page.tsx`):** Tracks current food stock, purchase dates, and calculated expiration dates.
* **Smart Alerts (`app/(protected)/alerts/page.tsx`):** Generates active notification cards for items nearing expiration or identified as spoiled.
* **Scan History (`app/(protected)/history/page.tsx`):** Searchable, filterable log of past food scans with status badges and instant detail views.
* **Food Waste Insights (`app/(protected)/insights/page.tsx`):** Analytics on food saved, financial savings estimates, and consumption habits.
* **User Profile & Settings (`profile/page.tsx`, `settings/page.tsx`):** Account controls, API configuration, theme toggles, and model selection preferences.

### 6.3 Visual Highlighting & Dual Overlay System
* **Server-Side Blending:** `SpoilDetector` renders semi-transparent orange-red highlights (`HIGHLIGHT_COLOR_BGR = (0, 69, 255)`, `HIGHLIGHT_ALPHA = 0.45`), contour borders, and confidence text tags onto the image, returning base64 data URLs (`highlighted_image_b64`).
* **Client-Side Bounding Box Overlay (`SpoiledRegionOverlay.tsx`):** Converts 0–1000 normalized coordinates into percentage-based CSS positioning with animated pulsating borders and badges.

```tsx
// Excerpt from SpoiledRegionOverlay.tsx
const [yMin, xMin, yMax, xMax] = region.box_2d;
const top = yMin / 10;
const left = xMin / 10;
const height = Math.max((yMax - yMin) / 10, 4);
const width = Math.max((xMax - xMin) / 10, 4);
```

### 6.4 Cloud Training, ONNX Export & Docker Containerization
* **Automated Cloud Training (`COLAB_KAGGLE_TRAINING.py`):** One-click Python script for Google Colab equipped with Kaggle API integration, dataset YAML generation, YOLOv8 Instance Segmentation (`yolov8n-seg.pt`) execution, and weight export (`best.pt`).
* **ONNX Model Export (`best.onnx`):** Includes converted ONNX runtime weights for low-latency CPU/edge deployment.
* **Docker Containerization (`Dockerfile`):**
```dockerfile
FROM python:3.9-slim
WORKDIR /app
RUN apt-get update && apt-get install -y libgl1-mesa-glx libglib2.0-0 && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 7860
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]
```

### 6.5 Project File Structure
```
AI FOODFRESHNESS/
├── app/                        # Next.js 16 App Router Pages
│   ├── (protected)/            # Protected User Portal Routes
│   │   ├── alerts/             # Smart Spoilage Warnings & Alerts
│   │   ├── dashboard/          # Analytics Dashboard (Recharts + Firestore)
│   │   ├── history/            # Historical Scan Activity Log
│   │   ├── insights/           # Food Waste & Financial Savings Analytics
│   │   ├── inventory/          # Active Food Inventory Tracker
│   │   ├── profile/            # User Profile Management
│   │   ├── result/             # Prediction Detail & Visual Overlay Page
│   │   ├── settings/           # Model & Engine Preference Settings
│   │   └── upload/             # Drag-and-Drop Image Analysis Gateway
│   ├── globals.css             # Tailwind CSS v4 Global Styling
│   ├── layout.tsx              # Root HTML & Theme Provider Layout
│   ├── page.tsx                # Public Landing Page (Hero, How It Works)
│   ├── login/                  # Firebase Auth Login Page
│   └── register/               # Firebase Auth Signup Page
├── backend/                    # FastAPI Backend Application
│   ├── api/routes/predict.py   # /predict & /detect-spoilage REST Endpoints
│   ├── config.py               # Model Paths & Highlighting Configuration
│   ├── main.py                 # FastAPI Application Entrypoint & CORS Setup
│   └── services/               # Core Business Logic Services
│       ├── cv_detector.py      # OpenCV HSV/LAB Spot & Contour Detector
│       ├── inference.py        # Multi-Engine Fallback Inference Manager
│       ├── rules.py            # Shelf-Life Rules Service Manager
│       └── spoil_detector.py   # YOLOv8 Spoilage Inference & Image Renderer
├── components/                 # Reusable UI & Layout Components
│   ├── Hero.tsx                # Hero Banner Component
│   ├── Navbar.tsx              # Main Navigation Bar
│   ├── Sidebar.tsx             # Protected App Sidebar Navigation
│   ├── SpoiledRegionOverlay.tsx# Client-Side Animated Bounding Box Overlay
│   └── ui/                     # Shadcn UI Base Components (Card, Table, etc.)
├── data/
│   └── shelfLifeRules.json     # Per-Food Item Rules Database
├── lib/                        # Utility Functions & Client SDKs
│   ├── firebase.ts             # Client Firebase SDK Initialization
│   ├── predictFood.ts          # API Client Service & Types
│   └── utils.ts                # Classname Merging Utilities
├── COLAB_KAGGLE_TRAINING.py    # One-Click Kaggle YOLOv8 Colab Training Script
├── COLAB_TRAINING.md           # Colab Segmentation Training Guide
├── KAGGLE_COLAB_GUIDE.md       # Detailed Kaggle Setup Instructions
├── Dockerfile                  # Container Configuration (Port 7860)
├── best.pt                     # PyTorch Trained Weights File
├── best.onnx                   # Exported ONNX Runtime Model
├── requirements.txt            # Python Dependency Specification
├── package.json                # Node.js Dependency Specification
└── README.md                   # Repository Documentation
```

---

## 7. Results & Verification

### 7.1 Feature Progression Matrix Across Milestones

| Feature / Capability | Milestone 1 | Milestone 2 | Milestone 3 (Current Release) |
|---|---|---|---|
| **User Interface** | None (Raw API) | Basic Client Request Form | Full-Stack Web App ("FreshTrack") with Dark/Light Themes |
| **Authentication** | None | Firebase Email/Password & Google Sign-In | Protected App Router Portals & Firestore Session Persistence |
| **AI Inference Pipeline** | Single YOLOv8 | Single YOLOv8 | Resilient 3-Tier Chain (Gemini 1.5 Flash $\rightarrow$ YOLOv8 $\rightarrow$ OpenCV) |
| **Defect Highlighting** | None | Pixel Ratio Calculation | Dual System: Server OpenCV Blending + Client Animated CSS BBoxes |
| **Shelf Life Estimation** | None | Generic Score Brackets | Knowledge-Base Rules Engine (`shelfLifeRules.json` per food item) |
| **Analytics & Reporting** | None | Single Response JSON | Recharts Analytics Dashboard, Inventory Manager, PDF Audit Export |
| **Deployment Formats** | Local Python Script | Local FastAPI Server | ONNX Export + Docker Containerization (Hugging Face / Cloud Port 7860) |

### 7.2 Sample Milestone 3 API Response
```json
{
  "status": "Success",
  "score": 88.2,
  "fresh_area": 88.2,
  "spoiled_area": 11.8,
  "food_name": "Apple",
  "freshness_category": "fresh",
  "shelf_life": "7-14 days",
  "recommendation": "Store in the crisper drawer of your refrigerator to maintain maximum crispness.",
  "spoiled_regions": [
    {
      "box_2d": [120, 340, 280, 510],
      "label": "discoloration",
      "confidence": 0.89
    }
  ],
  "highlighted_image_b64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "detection_source": "yolov8"
}
```

### 7.3 Milestone 3 Progress Summary

| Module / Feature | Status | Implementation Details |
|---|---|---|
| Next.js 16 Web Application ("FreshTrack") | **Completed** | Full design system, dark mode, responsive layouts |
| Protected App Router Portals | **Completed** | Firebase Auth protected dashboards and history |
| Multi-Engine AI Inference Pipeline | **Completed** | Fallback chain across Gemini 1.5 Flash, YOLOv8, OpenCV |
| Dual Visual Defect Overlay | **Completed** | Server OpenCV blending + Client animated CSS overlay |
| Knowledge-Base Rules Engine | **Completed** | `shelfLifeRules.json` with per-food item shelf-life mapping |
| Real-Time Analytics & Dashboard | **Completed** | `Recharts` distribution charts & Firestore logging |
| Inventory & Smart Alerts System | **Completed** | Active stock tracking, expiration warnings |
| ONNX Export & Docker Containerization | **Completed** | `best.onnx` runtime & Hugging Face `Dockerfile` (Port 7860) |
| Client-Side PDF Report Generation | **Completed** | Automated PDF quality audit export via `jspdf` |

---

## 8. Conclusion & Future Scope

### 8.1 Conclusion
Milestone 3 successfully evolves the **Food Monitoring Platform** into a full-stack, enterprise-ready food freshness management system ("FreshTrack"). By combining a Next.js 16 web interface with a multi-engine AI inference pipeline (Gemini 1.5 Flash, YOLOv8 segmentation, OpenCV spot detection), item-tailored rules engine, real-time analytics dashboards, dual visual overlays, ONNX exports, and Docker containerization, the system provides an end-to-end solution for automated food quality monitoring.

### 8.2 Future Scope & Roadmap
1. **IoT & Edge Camera Integration:** Deploying the ONNX model to low-cost embedded hardware (Raspberry Pi / Jetson Nano) for smart refrigerator monitoring.
2. **Barcode & RFID Scanning:** Combining visual freshness analysis with barcode metadata for automated grocery inventory intake.
3. **Multi-Item Batch Scanning:** Enhancing instance segmentation to analyze multiple distinct food produce items simultaneously within a single camera frame.
