# Slugime

A modern web application built with Flask (backend) and React (frontend).

## Project Structure

```
slugime_new/
├── backend/          # Flask API backend
│   ├── app.py       # Main application entry point
│   ├── models.py    # Database models
│   ├── schemas.py   # Data schemas
│   ├── security.py  # Authentication & security
│   └── config.py    # Configuration settings
└── frontend/         # React frontend
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── pages/       # Page components
    │   └── api.js       # API integration
    └── public/
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the Flask server:
   ```bash
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Technologies Used

### Backend
- Flask 3.0.3
- Flask-SQLAlchemy
- Flask-Cors
- Marshmallow
- Argon2 (password hashing)

### Frontend
- React 19.1.1
- Vite
- React Router
- Axios
- Tailwind CSS
- Lucide React (icons)

## License

MIT
