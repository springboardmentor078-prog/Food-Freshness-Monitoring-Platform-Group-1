FROM python:3.10-slim

WORKDIR /app

# No apt-get needed because we use opencv-python-headless

# Copy requirements and install
COPY requirements.txt .
# Upgrading pip and installing with no-cache-dir to keep image size down
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy source code and model weights
COPY . .

# Expose the FastAPI port
EXPOSE 8000

# Start Uvicorn server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
