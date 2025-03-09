FROM python:3.13-slim

WORKDIR /app

COPY requirements.txt .

# Install gunicorn
RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY app.py .
COPY backend/ ./backend/

EXPOSE 5000

# Use gunicorn instead of Flask development server
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]

