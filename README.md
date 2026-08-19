# 🍃 FoodFreshness (FreshSense AI)

FoodFreshness is an AI-powered full-stack web application designed to monitor food quality, estimate shelf life, detect spoilage risk, and provide intelligent storage recommendations to help reduce food waste.

This platform bridges advanced computer vision and machine learning with real-time IoT environmental data to deliver highly accurate freshness analytics.

---

## ✨ Core Features

*   *Dual AI Vision Models:* Utilizes deep learning models to identify the food category and classify its current freshness status.
*   *Surface Blemish Detection:* Uses computer vision algorithms to analyze surface damage, calculate spoilage percentage, and generate bounding boxes.
*   *Machine Learning Shelf-Life Prediction:* Employs regression models that evaluate the food category, ambient temperature, humidity, storage type, and visual score to estimate remaining shelf life.
*   *Smart Storage Engine:* Generates dynamic handling, storage, and rotation recommendations to extend produce lifespan.

---

## 🛠️ Tools & Tech Stack

This project is built using a modern, scalable, and robust technology stack:

*Programming Languages & Core Frameworks*
*   *Backend:* Python, FastAPI
*   *Frontend:* JavaScript, React.js, Next.js

*Databases*
*   *Primary Database:* PostgreSQL
*   *Secondary Database:* MongoDB

*AI, Machine Learning & Computer Vision*
*   *Frameworks:* TensorFlow, PyTorch
*   *Data Processing:* Pandas, NumPy, Scikit-learn
*   *Computer Vision:* OpenCV, YOLO, CNN Models, Image Augmentation Libraries

*IoT & Sensor Integration (Optional)*
*   *Hardware Sensors:* Temperature Sensors, Humidity Sensors
*   *Communication Protocol:* MQTT

*Cloud, DevOps & Additional Libraries*
*   *Cloud Hosting:* AWS / Azure
*   *Containerization:* Docker, Docker Compose
*   *Frontend Styling & Visualization:* Tailwind CSS, Chart.js, Plotly
*   *Security:* JWT Authentication

*Development & Deployment Tools*
*   *IDE:* VS Code
*   *Version Control & CI/CD:* Git & GitHub, GitHub Actions
*   *API Testing:* Postman

---

## 🚀 Architecture & Setup

### Backend (AI Inference Server)
1. Install the dependencies via pip install -r requirements.txt.
2. Ensure your pre-trained models (TensorFlow/Keras, XGBoost JSON, Encoders, etc.) are placed in the correct directories.
3. Start the Uvicorn server to expose the FastAPI endpoints. (Note: For heavy AI workloads, this can be run via Kaggle Notebooks and exposed using an Ngrok tunnel).

### Frontend (Client Application)
1. Navigate to the frontend directory.
2. Install the node modules:
   ```bash
   npm install
