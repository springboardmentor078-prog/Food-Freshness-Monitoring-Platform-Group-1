# 🍃 FreshSense AI — Food Freshness Monitoring Platform

FreshSense AI is an AI-assisted food analysis platform that evaluates a food image together with storage conditions to estimate freshness, identify visible spoilage indicators, predict approximate remaining shelf life, and suggest suitable storage practices.

The project combines a React user interface, a FastAPI-based inference service, computer vision, machine-learning models, and a lightweight SQLite data layer.

## Project Structure

```text
Food-Freshness-Monitoring-Platform/
├── frontend/                 # React + Vite user interface
├── backend/                  # FastAPI inference notebook
├── models/
│   └── notebooks/            # Training and experimentation notebooks
├── assets/                   # Sample images used for testing/demo
├── docs/                     # Project documentation
├── requirements.txt          # Python dependencies
├── .gitignore
└── README.md
```

## Key Capabilities

- **Food category recognition** using a trained vision model
- **Freshness classification** to estimate the current condition of the food
- **Visible damage analysis** with OpenCV-based image processing
- **Shelf-life estimation** using food type, environmental conditions, storage details, and visual indicators
- **Storage recommendations** to help improve handling and reduce avoidable waste
- **User authentication and analysis history** supported by the backend data layer
- **Interactive dashboard** for uploading images and viewing analysis results

## Technology Stack

**Frontend:** React, Vite, Tailwind CSS, Axios

**Backend:** Python, FastAPI, Uvicorn, SQLAlchemy

**AI / ML:** TensorFlow, PyTorch, Ultralytics/YOLO, OpenCV, XGBoost, Scikit-learn

**Data:** SQLite, Pandas, NumPy

## Quick Start

### 1. Start the backend

Install the Python packages:

```bash
pip install -r requirements.txt
```

Open and run `backend/freshness_backend.ipynb`. The notebook initializes the API and loads the trained models required for inference. Once running locally, the frontend expects the analysis endpoint at:

```text
http://localhost:8000/api/v1/food/analyze
```

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open the local Vite URL displayed in the terminal.

### 3. Configure a different backend (optional)

Copy `frontend/.env.example` to `frontend/.env` and update `VITE_API_URL` when using a remote or tunneled backend.

## Model Development

The training workflow is separated into three notebooks for easier maintenance:

1. `01_food_category_detection.ipynb` — food category detection experiments
2. `02_freshness_classification.ipynb` — freshness classification workflow
3. `03_shelf_life_prediction.ipynb` — remaining shelf-life prediction workflow

## Notes

The backend notebook was developed for a notebook-based AI runtime and may require the trained model artifacts to be attached or placed in the paths configured inside the notebook before deployment. For a production deployment, model paths and secrets should be moved to environment-based configuration.

## Testing Assets

Sample images are available in the `assets/` directory for quick interface and pipeline testing.
