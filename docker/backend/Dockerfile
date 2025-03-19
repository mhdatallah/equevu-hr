FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV POETRY_HOME=/opt/poetry
ENV PATH="${POETRY_HOME}/bin:${PATH}"

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 - \
    && chmod a+x /opt/poetry/bin/poetry

# Copy project files
COPY . .

# Install dependencies
RUN poetry config virtualenvs.create false \
    && poetry lock \
    && poetry install --no-interaction --no-ansi

# Create media directory with proper permissions
RUN mkdir -p /app/media && chmod 777 /app/media

# Run the application
CMD poetry run python manage.py makemigrations && poetry run python manage.py migrate && poetry run python manage.py runserver 0.0.0.0:8000 