# Office Display

A modern, full-stack office display application that shows real-time calendar events and weather information on a large screen. Perfect for office lobbies, meeting rooms, or any public display area.

## Features

- **Real-time Clock**: Large, easy-to-read digital clock with current date
- **Calendar Events**: Display upcoming calendar events with times and locations
- **Weather Display**: Real-time weather data with temperature, humidity, and conditions
- **Responsive Design**: Works on various screen sizes from tablets to large displays
- **Fullscreen Mode**: Press F11 to toggle fullscreen for kiosk-style deployment
- **Auto-refresh**: Data automatically updates at configurable intervals
- **RESTful API**: Well-documented backend API for easy integration

## Project Structure

```
Office-display/
├── office-display-backend/          # Flask backend application
│   ├── src/
│   │   ├── models/                  # Database models
│   │   │   ├── __init__.py
│   │   │   └── user.py              # User model
│   │   ├── routes/                  # API route handlers
│   │   │   ├── __init__.py
│   │   │   ├── user.py              # User management endpoints
│   │   │   ├── calendar.py          # Calendar events endpoints
│   │   │   └── weather.py           # Weather data endpoints
│   │   └── __init__.py
│   ├── database/                    # SQLite database (created on first run)
│   ├── main.py                      # Flask application entry point
│   ├── requirements.txt             # Python dependencies
│   ├── .env.example                 # Environment configuration template
│   └── google_calendar.py           # Google Calendar integration guide
│
├── office-display-frontend/         # React + Vite frontend application
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── index.js
│   │   │   ├── Clock.jsx            # Clock display component
│   │   │   ├── CalendarEvents.jsx   # Calendar events component
│   │   │   └── WeatherDisplay.jsx   # Weather display component
│   │   ├── App.jsx                  # Main app component
│   │   ├── App.css                  # App styles
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles
│   ├── public/                      # Static assets
│   ├── index.html                   # HTML entry point
│   ├── package.json                 # Node.js dependencies
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── postcss.config.js            # PostCSS configuration
│   ├── .env.example                 # Environment configuration template
│   └── .gitignore
│
├── README.md                        # This file
├── CONTRIBUTING.md                  # Contribution guidelines
├── .gitignore                       # Git ignore rules
└── Quick_Setup_Guide.md             # Quick setup instructions
```

## Technology Stack

### Backend
- **Framework**: Flask 2.3.3
- **Database**: SQLAlchemy with SQLite (configurable)
- **API**: RESTful with JSON responses
- **Weather Data**: Open-Meteo API (free, no API key required)
- **CORS**: Flask-CORS for cross-origin requests

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 4.4.5
- **Styling**: Tailwind CSS 3.3.3
- **Icons**: Lucide React 0.263.1
- **HTTP Client**: Fetch API

## Quick Start

### Prerequisites

- **Node.js** v18+ (for frontend)
- **Python** v3.11+ (for backend)
- **npm** or **pnpm** (for frontend package management)

### 5-Minute Setup

#### Step 1: Backend Setup (2 minutes)

```bash
# Navigate to backend directory
cd office-display-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # Linux/Mac
# OR
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Start backend server
python main.py
```

✅ Backend running at `http://localhost:5000`

#### Step 2: Frontend Setup (2 minutes)

Open a new terminal:

```bash
# Navigate to frontend directory
cd office-display-frontend

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

✅ Frontend running at `http://localhost:5174`

#### Step 3: Test the Application (1 minute)

1. Open your browser to `http://localhost:5174`
2. You should see:
   - Real-time clock at the top
   - Calendar events on the left
   - Live weather data on the right
3. Press **F11** for fullscreen mode

## Configuration

### Backend Configuration

Create a `.env` file in `office-display-backend/` based on `.env.example`:

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your settings
```

Key configuration options:

- `FLASK_ENV`: Set to `development` or `production`
- `FLASK_PORT`: Port number (default: 5000)
- `WEATHER_LATITUDE`: Office latitude coordinate
- `WEATHER_LONGITUDE`: Office longitude coordinate
- `DATABASE_URL`: Database connection string

### Frontend Configuration

Create a `.env.local` file in `office-display-frontend/` based on `.env.example`:

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your settings
```

Key configuration options:

- `VITE_API_URL`: Backend API URL (default: http://localhost:5000)
- `VITE_CALENDAR_REFRESH_INTERVAL`: Calendar refresh interval in ms
- `VITE_WEATHER_REFRESH_INTERVAL`: Weather refresh interval in ms

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Calendar Events

**Get Calendar Events**
```http
GET /api/calendar/events
```

Response:
```json
{
  "events": [
    {
      "id": "1",
      "title": "Team Meeting",
      "start": "2025-01-15T10:00:00",
      "end": "2025-01-15T11:00:00",
      "location": "Conference Room A",
      "description": "Weekly team sync"
    }
  ],
  "status": "success"
}
```

#### Weather

**Get Current Weather**
```http
GET /api/weather/current?lat=37.7749&lon=-122.4194
```

Query Parameters:
- `lat` (optional): Latitude coordinate (default: 37.7749)
- `lon` (optional): Longitude coordinate (default: -122.4194)

Response:
```json
{
  "weather": {
    "temperature": 72,
    "humidity": 65,
    "description": "Partly cloudy",
    "weather_code": 2,
    "location": "Lat: 37.7749, Lon: -122.4194",
    "last_updated": "2025-01-15T10:30:00"
  },
  "status": "success"
}
```

#### User Management

**Get All Users**
```http
GET /api/users
```

**Create User**
```http
POST /api/users
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com"
}
```

**Get User**
```http
GET /api/users/{user_id}
```

**Update User**
```http
PUT /api/users/{user_id}
Content-Type: application/json

{
  "username": "jane_doe",
  "email": "jane@example.com"
}
```

**Delete User**
```http
DELETE /api/users/{user_id}
```

#### Health Check

**Check Backend Health**
```http
GET /api/health
```

Response:
```json
{
  "status": "healthy",
  "message": "Office Display Backend is running"
}
```

## Deployment

### Docker Deployment

Create a `Dockerfile` in the project root:

```dockerfile
FROM python:3.11-slim as backend
WORKDIR /app
COPY office-display-backend/requirements.txt .
RUN pip install -r requirements.txt
COPY office-display-backend .
EXPOSE 5000
CMD ["python", "main.py"]
```

### Production Deployment

For production deployment, consider:

1. **Use a production WSGI server** (Gunicorn, uWSGI)
2. **Set up a reverse proxy** (Nginx, Apache)
3. **Enable HTTPS** with SSL certificates
4. **Configure database** (PostgreSQL, MySQL)
5. **Set up monitoring** and logging
6. **Use environment variables** for secrets

See [CONTRIBUTING.md](CONTRIBUTING.md) for deployment guidelines.

## Troubleshooting

### Frontend shows "Unable to load" errors
- Ensure backend is running on port 5000
- Check that CORS is enabled in Flask
- Verify API URL in `.env.local`

### Weather not loading
- Check internet connection
- Verify latitude/longitude coordinates
- Check Open-Meteo API status

### Can't enter fullscreen
- Click on the page first, then press F11
- Some browsers may require user gesture

### Database errors
- Ensure `database/` directory exists
- Check file permissions
- Delete `database/app.db` to reset database

## Future Enhancements

- [ ] Google Calendar API integration
- [ ] Microsoft Teams integration
- [ ] Multiple display support
- [ ] Admin dashboard for configuration
- [ ] Real-time notifications
- [ ] Custom branding/theming
- [ ] Mobile app companion
- [ ] Analytics and usage tracking

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.

## Changelog

### Version 1.0.0 (Initial Release)
- Initial project structure and setup
- Calendar events display
- Real-time weather display
- Clock and date display
- Responsive design
- Fullscreen mode support

---

**Last Updated**: January 2025
**Maintainer**: Office Display Team
