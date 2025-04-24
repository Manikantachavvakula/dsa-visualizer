FROM python:3.9
WORKDIR /app

# Install Docker CLI
RUN apt-get update && \
    apt-get install -y docker.io && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV MONGO_URI="mongodb://localhost:27017/code_executor"

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]