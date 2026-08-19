# FreshTrack AI - Food Freshness & Spoilage Detection System

An AI-powered web application for real-time food freshness scoring, shelf-life estimation, and localized spoilage defect detection using YOLOv8 deep learning and multi-spectral computer vision.

---

## 📋 Prerequisites & Environment Requirements

* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* **Python**: v3.10 or higher

---

## ⚙️ Environment Configuration

1. Copy `.env.example` to `.env.local` in the project root:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in your Firebase configuration values in `.env.local` (or leave the defaults for local testing):
   * `NEXT_PUBLIC_FIREBASE_API_KEY`: Your Firebase project API Key
   * `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Firebase Auth domain
   * `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Firebase project ID
   * `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Storage bucket URL
   * `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Firebase Sender ID
   * `NEXT_PUBLIC_FIREBASE_APP_ID`: Firebase Web App ID
   * `NEXT_PUBLIC_API_URL`: Backend API URL (Default: `http://localhost:8000`)

---

## 🚀 Installation & Running the Application

### 1. Frontend Setup (Next.js 16 + React 19)

Open a terminal in the project root folder:

```bash
# Install Node.js dependencies
npm install

# Start Next.js development server
npm run dev
```

* **Frontend URL**: `http://localhost:3000`

---

### 2. Backend Setup (FastAPI + YOLOv8 PyTorch / OpenCV)

Open a **second terminal** in the project root folder:

```bash
# Create Python virtual environment
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.\.venv\Scripts\activate
# Linux / macOS:
source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI server
python -m uvicorn backend.main:app --reload --port 8000
```

* **Backend API URL**: `http://localhost:8000`
* **Interactive API Docs (Swagger UI)**: `http://localhost:8000/docs`

---

## 📁 Project Architecture

```text
├── app/                  # Next.js App Router (Pages, UI Layouts & Routes)
├── backend/              # FastAPI Python Backend
│   ├── main.py           # API Entry Point & CORS Setup
│   ├── config.py         # Model paths & threshold configuration
│   ├── api/routes/       # API Routes (/predict endpoint)
│   └── services/         # YOLOv8 inference, CV pixel-mapping & rules engine
├── components/           # Reusable UI Components (Upload, Results, Charts)
├── lib/                  # Utility functions & Firebase client configuration
├── public/               # Static assets & icons
├── best.pt               # Fine-tuned YOLOv8 model weights
├── best.onnx             # Optimized ONNX runtime weights
├── requirements.txt      # Python dependencies
├── package.json          # Node.js dependencies & scripts
├── .env.example          # Environment variables template
└── README.md             # Project documentation
```

---

## 🧪 Testing the API

You can test the backend health check endpoint:
```bash
curl http://localhost:8000/
```
Output:
```json
{"status": "ok", "message": "AI Food Freshness API is running"}
```
