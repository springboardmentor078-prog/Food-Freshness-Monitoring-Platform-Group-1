# Project Overview

FreshSense AI processes a food image and optional environmental information through a staged analysis pipeline:

1. The user uploads a food image from the web application.
2. The FastAPI service validates and preprocesses the input.
3. Vision models estimate the food category and freshness state.
4. OpenCV routines evaluate visible dark or damaged regions.
5. A shelf-life model combines visual output with temperature, humidity, and storage context.
6. The API returns a consolidated analysis with freshness information and storage guidance.

The frontend is designed independently from the inference runtime so the API endpoint can be changed through `VITE_API_URL` without modifying the application code.
