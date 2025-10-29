# Backend - Flask API

This is the backend API for the Slugime application, built with Flask.

## Setup

1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update `SECRET_KEY` with a secure random key
   - Adjust other settings as needed

4. Run the application:
   ```bash
   python app.py
   ```

The API will be available at `http://127.0.0.1:5000`

## Environment Variables

- `SECRET_KEY`: Secret key for session encryption (required in production)
- `DATABASE_URI`: Database connection string (default: SQLite)
- `CORS_ORIGINS`: Comma-separated list of allowed origins
- `UPLOAD_FOLDER`: Directory for file uploads

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user

### Feed & Posts
- `GET /api/v1/feed` - Get feed posts
- `POST /api/v1/posts` - Create a new post
- `POST /api/v1/posts/<id>/like` - Like/unlike a post
- `POST /api/v1/posts/<id>/save` - Save/unsave a post
- `POST /api/v1/posts/<id>/comments` - Add comment to post

### Whistleblower Reports
- `GET /api/v1/reports/public` - Get public reports
- `POST /api/v1/reports` - Create anonymous report
- `GET /api/v1/reports/<ticket>` - Get specific report (requires access code)
- `POST /api/v1/reports/<ticket>/messages` - Add message to report

## Security

- Passwords are hashed using Argon2
- Access codes for reports are hashed
- JWT tokens are used for authentication
- CORS is configured to restrict origins
