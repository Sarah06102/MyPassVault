# Use a slim Python image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install dependencies
COPY backend/mypassvault/requirements.txt .
RUN pip install -r requirements.txt

# Copy app files
COPY backend/mypassvault /app
COPY backend/manage.py /app

# Start server with gunicorn
CMD gunicorn mypassvault.wsgi:application --bind 0.0.0.0:$PORT