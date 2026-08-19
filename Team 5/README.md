# FreshSense AI — Food Freshness Monitoring Platform

![FreshSense Logo](https://img.icons8.com/color/96/leaf.png)

> **AI-powered platform for real-time food freshness assessment, shelf-life prediction, and spoilage detection.**

FreshSense AI uses Computer Vision (YOLOv8) and Machine Learning (LightGBM) to analyze images of fruits and vegetables. Users can upload a photo of their food, and the system detects the fruit, highlights rotten areas with red contours, provides a freshness score (0–100), and predicts the remaining shelf life in days.

---

## 🚀 Features

- **📷 AI-Powered Image Analysis** – Upload images for instant freshness detection.
- **🔬 Multi-Fruit Segmentation** – Detects multiple fruits per image using YOLOv8.
- **🎯 Accurate Bounding Boxes** – Perfect green boxes around every detected fruit.
- **🔴 Visual Spoilage Detection** – Highlights brown spots, rot, and bruising with precise red contours using OpenCV.
- **📊 Freshness Scoring Engine** – Dynamic score from 0–100 based on visual rot percentage.
- **⏳ Shelf-Life Prediction** – LightGBM regression model predicts remaining days (R² = 95.98%).
- **💡 Intelligent Recommendations** – AI-generated storage and consumption tips.
- **📦 Full Inventory Management** – Add, edit, delete, and track food items.
- **👤 Role-Based Access Control** – Supports Consumer, Retail Manager, and Administrator roles.
- **📈 Interactive Dashboard** – Visual charts for inventory distribution and freshness trends.
- **📜 Prediction History** – View past AI analysis results for any food item.

---

## 🧠 Machine Learning Models

| Model | Architecture | Purpose | Performance |
| :--- | :--- | :--- | :--- |
| **Segmentation** | YOLOv8s-seg | Detects & crops fruits | Box mAP@50: 65.22% |
| **Classification** | YOLOv8n-cls | Classifies Fresh vs Rotten | Test Top-1 Accuracy: 99.40% |
| **Shelf-Life** | LightGBM | Predicts remaining days | R²: 95.98% |

---

## 🛠 Tech Stack

### Backend
- **Framework:** FastAPI
- **Database:** SQLAlchemy (SQLite / PostgreSQL)
- **Authentication:** JWT + Bcrypt
- **Computer Vision:** OpenCV, Ultralytics YOLOv8
- **ML Library:** LightGBM, Pandas, NumPy

### Frontend
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS (Glassmorphism UI)
- **Charts:** Recharts
- **API Client:** Axios
- **Routing:** React Router DOM

---

## 📂 Project Structure

```text
food-freshness-platform/
├── backend/
│   ├── main.py                # FastAPI entrypoint
│   ├── models.py              # SQLAlchemy ORM
│   ├── schemas.py             # Pydantic response models
│   ├── routers/               # API route handlers
│   └── services/              # AI and business logic
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx            # Main routing
│       ├── api/axios.js       # Centralized API client
│       ├── context/           # Auth state management
│       ├── components/        # Reusable UI components
│       └── pages/             # Full-page views
├── model/
│   ├── classification/        # YOLOv8 .pt weights
│   ├── segmentation/          # YOLOv8s-seg .pt weights
│   └── shelf life/            # LightGBM .txt model
└── yolov8n.pt                 # Base YOLO model
⚙️ Installation & Setup
Prerequisites
Python 3.10+

Node.js 18+

1. Clone the repository
bash
git clone https://github.com/your-username/freshsense-ai.git
cd freshsense-ai

2. Backend Setup (PowerShell / Terminal)
bash
cd backend
python -m venv venv

# Windows (PowerShell)
.\venv\Scripts\Activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload

3. Frontend Setup (New Terminal)
bash
cd frontend
npm install
npm run dev

4. Access the Application
Open your browser and navigate to: http://localhost:5173

🖥️ How to Use
Register an account and log in.
Go to Inventory and click Add Food Item to create a test item (e.g., "Banana").
Go to Scan Food, select your item from the dropdown, and upload an image of the fruit.
Wait for the analysis (6-step pipeline visible).
View your results: Freshness Score, Shelf Life, Rot Percentage, and an annotated image showing green boxes + red rot contours.

🐛 Known Issues & Future Work
Segmentation Model: Currently trained on 22 classes. Expanding to 50+ classes is planned for future iterations.
Real-Time IoT Integration: Future version will connect to live temperature/humidity sensors for automated data capture.

