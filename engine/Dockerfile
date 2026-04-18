FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (for gevent and psycopg2)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY pyproject.toml .
RUN pip install --no-cache-dir .

# Copy application code
COPY worker/ ./worker/
COPY collectors/ ./collectors/
COPY policies/ ./policies/
COPY opa_client.py ./

# Set Python path to include /app
ENV PYTHONPATH=/app

# Copy and run entrypoint
COPY worker_entrypoint.sh .
RUN chmod +x worker_entrypoint.sh

# Run as non-root user for security
RUN adduser --disabled-password --gecos "" --uid 1000 appuser && chown -R appuser:appuser /app
USER appuser

CMD ["./worker_entrypoint.sh"]
