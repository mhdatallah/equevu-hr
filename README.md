# Equevu HR System

A modern HR management system built with Django and React.

## Features

- Job application management
- Candidate tracking
- Resume storage and management
- Department management
- User authentication and authorization

## Tech Stack

- Backend: Django 5.0
- Frontend: React with Vite
- Database: PostgreSQL
- File Storage: Local or AWS S3
- API Documentation: Swagger/OpenAPI

## Project Structure

```
equevu-hr/
├── frontend/          # React frontend application
├── backend/          # Django backend application
├── docker/          # Docker configuration files
└── docker-compose.yml
```

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.11+ (for local backend development)
- Poetry (Python package manager)
- PostgreSQL (if running locally)
- AWS S3 (optional, for production)

## Running with Docker

1. Clone the repository:
   ```bash
   git clone https://github.com/mhdatallah/equevu-hr.git
   cd equevu-hr
   ```

2. Set up your environment:
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your settings
   # For Docker setup, use the DATABASE_URL
   # For local setup, comment out DATABASE_URL and uncomment the POSTGRES_* variables
   ```

3. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

4. Access the applications:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Admin Interface: http://localhost:8000/admin

## Development Setup

### Frontend Development

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at http://localhost:3000

### Backend Development

1. Install Poetry if you haven't already:
   ```bash
   curl -sSL https://install.python-poetry.org | python3 -
   ```

2. Install dependencies:
   ```bash
   poetry install
   ```

3. Run migrations:
   ```bash
   poetry run python manage.py migrate
   ```

4. Start the development server:
   ```bash
   poetry run python manage.py runserver
   ```

The backend will be available at http://localhost:8000

## API Documentation

The API documentation is available at http://localhost:8000/api/docs/ when running the backend server.

## API Endpoints

### Candidates

- `GET /api/candidates/` - List all candidates (requires admin access)
- `POST /api/candidates/` - Create a new candidate
- `GET /api/candidates/{id}/resume/` - Download candidate's resume (requires admin access)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.