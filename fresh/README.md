# FreshDetect - AI Food Freshness Monitoring Platform

FreshDetect is a full-stack food freshness monitoring platform. It includes a React dashboard, an Express API, and a FastAPI image-analysis engine for scanning food images, estimating freshness, and returning storage or disposal recommendations.

## Project Structure

```text
.
├── frontend/                  # React + Vite web app
├── backend/                   # Express API and MongoDB models
├── Image Analysis & Freshness/ # FastAPI AI image-analysis service
├── docker-compose.yml         # Runs all services together
└── render.yaml                # Deployment configuration
```

## Features

- User registration and login with JWT authentication
- Dashboard and inventory management screens
- Food image scanner with freshness score and status
- Storage, shelf-life, and disposal recommendations
- Presentation mode fallback when MongoDB or the AI service is unavailable
- Docker Compose setup for running the frontend, backend, and AI engine together

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Recharts, Lucide React
- Backend: Node.js, Express, Mongoose, JWT, Multer
- AI service: Python, FastAPI, TensorFlow, OpenCV, Pillow
- Database: MongoDB
- Deployment: Docker, Render, Vercel/GitHub Pages config

## Prerequisites

- Node.js and npm
- Python 3.10+ recommended
- MongoDB connection string for persistent data
- Docker Desktop, if running with Docker Compose

## Environment Variables

Create a `.env` file in `backend/` for local backend development:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/freshdetect
JWT_SECRET=replace-with-a-secure-secret
PYTHON_API_URL=http://localhost:8000
```

For the frontend, create `frontend/.env` when the API is not served from the same origin:

```env
VITE_API_URL=http://localhost:5000
```

If `MONGODB_URI` is missing or invalid, the backend runs in presentation mode with sample data.

## Run Locally

### 1. Start the AI engine

```bash
cd "Image Analysis & Freshness"
pip install -r requirements.txt
python main.py
```

The AI service runs at `http://localhost:8000`.

### 2. Start the backend

```bash
cd backend
npm install
node server.js
```

The backend runs at `http://localhost:5000`.

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite app runs at the local URL printed in the terminal, usually `http://localhost:5173`.

## Run With Docker

From the project root:

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost`
- Backend: `http://localhost:5000`
- AI engine: `http://localhost:8000`

## API Overview

Backend routes:

- `POST /api/auth/register` - create a user
- `POST /api/auth/login` - log in and receive a JWT
- `GET /api/inventory` - list food inventory items
- `POST /api/inventory` - add an inventory item
- `PUT /api/inventory/:id` - update an inventory item
- `DELETE /api/inventory/:id` - delete an inventory item
- `POST /api/analysis/scan` - upload an image for freshness analysis

AI engine routes:

- `GET /` - health check
- `POST /api/analyze` - analyze an uploaded image file

## Useful Commands

Frontend:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

Backend:

```bash
node server.js
```

AI engine:

```bash
python main.py
```

## Notes

- The backend can return fallback AI results if the Python service is unavailable.
- Model files and class JSON files live inside `Image Analysis & Freshness/`.
- The root `docker-compose.yml` connects the backend to the AI engine through `PYTHON_API_URL=http://ai-engine:8000`.
