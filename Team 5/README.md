# Food Freshness Assessment & Prediction Platform - Full Source Code

> **Consolidated Source Code Document**  
> This document aggregates all source code files across backend services, frontend pages/components, configuration, and model pipelines into a single file for easy sharing with LLMs (e.g. DeepSeek).

# 1. Move into the backend folder
cd backend
python -m venv venv
.\venv\Scripts\Activate

pip install -r requirements.txt

# 5. Run the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 1. Move into the frontend folder
cd frontend
npm install
npm run dev

## Project Directory Structure Overview

```text
food-freshness-platform/
├── backend/
│   ├── auth.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── requirements.txt
│   ├── schemas.py
│   ├── routers/
│   │   ├── auth_router.py
│   │   ├── food_items_router.py
│   │   ├── images_router.py
│   │   └── predictions_router.py
│   └── services/
│       ├── ai_service.py
│       ├── classifier_service.py
│       ├── defect_detection_service.py
│       ├── scoring_service.py
│       ├── segmentation_service.py
│       └── shelf_life_service.py
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── api/
│       │   └── axios.js
│       ├── components/
│       │   ├── FreshnessCard.jsx
│       │   ├── ImageUpload.jsx
│       │   ├── Navbar.jsx
│       │   ├── PredictionResult.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── StatCard.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       └── pages/
│           ├── AdminPage.jsx
│           ├── DashboardPage.jsx
│           ├── InventoryPage.jsx
│           ├── LandingPage.jsx
│           ├── LoginPage.jsx
│           ├── RegisterPage.jsx
│           └── ScanPage.jsx
└── model/
    ├── classification/ (yolov8n_cls .pt weights)
    ├── segmentation/ (yolov8 seg weights & args)
    └── shelf life/ (LightGBM shelf life model & notebooks)
```

