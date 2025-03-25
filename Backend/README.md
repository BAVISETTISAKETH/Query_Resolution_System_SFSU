# University Query Resolution System - Backend

This is the backend API for the University Query Resolution System, which provides query handling, authentication, and feedback mechanisms for university-specific queries.

## Features

- User authentication (student and faculty roles)
- Query submission and response
- Feedback and flagging system for incorrect responses
- Faculty interface for responding to flagged queries

## Tech Stack

- FastAPI - Web framework
- Supabase - Authentication and database
- Pydantic - Data validation
- Uvicorn - ASGI server

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Copy `.env.example` to `.env` and fill in your Supabase credentials
4. Run the application:
   ```
   uvicorn app.main:app --reload
   ```

## API Documentation

Once the server is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login and get token
- POST /api/auth/logout - Logout
- GET /api/auth/me - Get current user info

### Queries
- POST /api/queries/submit - Submit a new query
- GET /api/queries/history - Get user's query history
- GET /api/queries/{query_id} - Get a specific query

### Feedback
- POST /api/feedback/flag-response - Flag a response as incorrect
- GET /api/feedback/pending - Get pending feedback (faculty only)
- POST /api/feedback/{feedback_id}/respond - Respond to feedback (faculty only)

## Development

Currently using a mock LLM service with canned responses. This will be replaced with the actual fine-tuned model in a later phase.
