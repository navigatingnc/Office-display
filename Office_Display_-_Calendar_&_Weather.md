# Office Display - Calendar & Weather

An open-source full-screen display application designed for wall-mounted office displays. Shows real-time calendar events and local weather information in a clean, professional interface.

## Features

- **Real-time Clock**: Large, easy-to-read digital clock with current date
- **Calendar Events**: Displays upcoming events from Google Calendar (placeholder implementation included)
- **Weather Information**: Real-time weather data from Open-Meteo API
- **Full-screen Mode**: Optimized for always-on displays with F11 fullscreen toggle
- **Responsive Design**: Adapts to different screen sizes and orientations
- **Auto-refresh**: Automatically updates weather and calendar data
- **Error Handling**: Graceful handling of API failures and network issues

## Architecture

The application consists of two main components:

### Backend (Flask)
- **Framework**: Python Flask with CORS enabled
- **APIs**: RESTful endpoints for calendar and weather data
- **Weather Integration**: Open-Meteo API for real-time weather data
- **Calendar Integration**: Placeholder for Google Calendar API (ready for implementation)

### Frontend (React)
- **Framework**: React with Vite build system
- **Styling**: Tailwind CSS with shadcn/ui components
- **Icons**: Lucide React icons
- **Features**: Real-time updates, fullscreen support, responsive design

## Project Structure

```
office-display/
├── office-display-backend/          # Flask backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── calendar.py         # Calendar API endpoints
│   │   │   ├── weather.py          # Weather API endpoints
│   │   │   ├── user.py             # User management (template)
│   │   │   └── google_calendar.py  # Google Calendar integration guide
│   │   ├── models/                 # Database models
│   │   ├── static/                 # Static files (for frontend deployment)
│   │   └── main.py                 # Flask application entry point
│   ├── venv/                       # Python virtual environment
│   └── requirements.txt            # Python dependencies
├── office-display-frontend/         # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── CalendarEvents.jsx  # Calendar events component
│   │   │   ├── WeatherDisplay.jsx  # Weather display component
│   │   │   ├── Clock.jsx           # Real-time clock component
│   │   │   └── ui/                 # shadcn/ui components
│   │   ├── App.jsx                 # Main application component
│   │   └── main.jsx                # React entry point
│   ├── public/                     # Static assets
│   ├── package.json                # Node.js dependencies
│   └── vite.config.js              # Vite configuration with proxy
└── README.md                       # This file
```



## Installation & Setup

### Prerequisites

- **Node.js** (v20 or higher)
- **Python** (v3.11 or higher)
- **npm** or **pnpm** package manager

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd office-display-backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the Flask development server:**
   ```bash
   python src/main.py
   ```

   The backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd office-display-frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   pnpm install  # or npm install
   ```

3. **Start the React development server:**
   ```bash
   pnpm run dev --host  # or npm run dev -- --host
   ```

   The frontend will be available at `http://localhost:5174`

### Quick Start

For development, you need both servers running:

1. **Terminal 1 - Backend:**
   ```bash
   cd office-display-backend
   source venv/bin/activate
   python src/main.py
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd office-display-frontend
   pnpm run dev --host
   ```

3. **Open your browser** and navigate to `http://localhost:5174`

4. **Press F11** to enter fullscreen mode for the optimal display experience


## API Documentation

### Weather API

**Endpoint:** `GET /api/weather/current`

**Query Parameters:**
- `lat` (optional): Latitude for weather location (default: 37.7749)
- `lon` (optional): Longitude for weather location (default: -122.4194)

**Response:**
```json
{
  "status": "success",
  "weather": {
    "temperature": 18,
    "humidity": 74,
    "description": "Clear sky",
    "weather_code": 0,
    "location": "Lat: 37.7749, Lon: -122.4194",
    "last_updated": "2025-07-02T15:00"
  }
}
```

### Calendar API

**Endpoint:** `GET /api/calendar/events`

**Response:**
```json
{
  "status": "success",
  "events": [
    {
      "id": "1",
      "title": "Team Meeting",
      "start": "2025-07-02T19:02:16.153505",
      "end": "2025-07-02T20:02:16.153534",
      "location": "Conference Room A"
    }
  ]
}
```

## Configuration

### Weather Location

To change the default weather location, modify the coordinates in `office-display-backend/src/routes/weather.py`:

```python
# Default coordinates (can be made configurable)
latitude = 37.7749   # Your office latitude
longitude = -122.4194  # Your office longitude
```

Or pass coordinates as query parameters:
```
GET /api/weather/current?lat=40.7128&lon=-74.0060
```

### Google Calendar Integration

The application includes a placeholder for Google Calendar integration. To implement real Google Calendar access:

1. **Set up Google Cloud Project:**
   - Create a project in Google Cloud Console
   - Enable the Google Calendar API
   - Create credentials (Service Account or OAuth 2.0)

2. **Install Google API client:**
   ```bash
   pip install google-api-python-client google-auth
   ```

3. **Implement authentication:**
   - Follow the guide in `office-display-backend/src/routes/google_calendar.py`
   - Add your service account key or OAuth credentials
   - Update the calendar routes to use real Google Calendar API

4. **Environment Variables:**
   ```bash
   export GOOGLE_CALENDAR_ID="your-calendar-id@gmail.com"
   export GOOGLE_SERVICE_ACCOUNT_KEY="/path/to/service-account-key.json"
   ```


## Deployment

### Production Deployment

For production deployment, you'll want to build the frontend and serve it through the Flask backend:

1. **Build the React frontend:**
   ```bash
   cd office-display-frontend
   pnpm run build  # or npm run build
   ```

2. **Copy built files to Flask static directory:**
   ```bash
   cp -r dist/* ../office-display-backend/src/static/
   ```

3. **Update Flask requirements:**
   ```bash
   cd office-display-backend
   source venv/bin/activate
   pip freeze > requirements.txt
   ```

4. **Deploy using a production WSGI server:**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 src.main:app
   ```

### Docker Deployment (Optional)

Create a `Dockerfile` in the project root:

```dockerfile
FROM python:3.11-slim

# Install Node.js
RUN apt-get update && apt-get install -y nodejs npm

# Set working directory
WORKDIR /app

# Copy and build frontend
COPY office-display-frontend/ ./frontend/
WORKDIR /app/frontend
RUN npm install && npm run build

# Copy backend
WORKDIR /app
COPY office-display-backend/ ./backend/

# Copy built frontend to Flask static directory
RUN cp -r frontend/dist/* backend/src/static/

# Install Python dependencies
WORKDIR /app/backend
RUN pip install -r requirements.txt

# Expose port
EXPOSE 5000

# Start the application
CMD ["python", "src/main.py"]
```

### Kiosk Mode Setup

For a dedicated office display:

1. **Auto-start browser in kiosk mode:**
   ```bash
   chromium-browser --kiosk --disable-infobars --disable-session-crashed-bubble http://localhost:5000
   ```

2. **Disable screen saver and power management:**
   ```bash
   xset s off
   xset -dpms
   xset s noblank
   ```

3. **Auto-refresh page daily:**
   Add to crontab:
   ```bash
   0 6 * * * pkill chromium && chromium-browser --kiosk http://localhost:5000
   ```

## Usage

### Basic Operation

1. **Start the application** following the installation steps
2. **Open in browser** and navigate to the frontend URL
3. **Press F11** to enter fullscreen mode
4. **The display will automatically:**
   - Update the clock every second
   - Refresh weather data every 10 minutes
   - Refresh calendar events every 5 minutes

### Customization

#### Styling
- Modify `office-display-frontend/src/App.css` for custom themes
- Update Tailwind classes in React components for layout changes
- Change colors and fonts in the CSS custom properties

#### Refresh Intervals
- Weather: Modify the interval in `WeatherDisplay.jsx` (default: 10 minutes)
- Calendar: Modify the interval in `CalendarEvents.jsx` (default: 5 minutes)
- Clock: Updates every second automatically

#### Display Content
- Add more weather details by updating the Open-Meteo API parameters
- Customize calendar event display in `CalendarEvents.jsx`
- Add additional information panels by creating new React components


## Troubleshooting

### Common Issues

**Frontend shows "Unable to load events/weather":**
- Ensure the Flask backend is running on port 5000
- Check that CORS is enabled in the Flask configuration
- Verify the Vite proxy configuration in `vite.config.js`

**Weather data not updating:**
- Check internet connectivity
- Verify the Open-Meteo API is accessible
- Check browser console for API errors

**Calendar events not showing:**
- Currently shows placeholder data
- Implement Google Calendar API integration for real events
- Check the calendar API endpoint response format

**Fullscreen mode not working:**
- Some browsers require user interaction before allowing fullscreen
- Try clicking on the page first, then press F11
- Check browser permissions for fullscreen access

### Development Tips

**Hot Reload:**
- Frontend changes are automatically reflected (Vite HMR)
- Backend changes require restarting the Flask server
- Use `--reload` flag with Flask for auto-restart: `flask run --reload`

**API Testing:**
```bash
# Test weather API
curl http://localhost:5000/api/weather/current

# Test calendar API
curl http://localhost:5000/api/calendar/events
```

**Browser Console:**
- Open Developer Tools (F12) to check for JavaScript errors
- Monitor Network tab for failed API requests
- Check Console for React component errors

## Contributing

We welcome contributions to improve the Office Display application!

### Getting Started

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

### Development Guidelines

- **Code Style:** Follow existing code formatting and conventions
- **Testing:** Test both frontend and backend changes
- **Documentation:** Update README.md for new features
- **API Changes:** Maintain backward compatibility when possible

### Areas for Contribution

- **Google Calendar Integration:** Complete the Google Calendar API implementation
- **Additional Weather Data:** Add more weather information (forecast, alerts, etc.)
- **Themes:** Create different visual themes and color schemes
- **Mobile Support:** Improve responsive design for mobile devices
- **Configuration UI:** Add a web interface for configuration
- **Multiple Calendars:** Support for multiple calendar sources
- **Notifications:** Add support for important event notifications

## License

This project is open source and available under the [MIT License](LICENSE).

```
MIT License

Copyright (c) 2025 Office Display Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Acknowledgments

- **Open-Meteo** for providing free weather API access
- **Google Calendar API** for calendar integration capabilities
- **React** and **Flask** communities for excellent documentation
- **Tailwind CSS** and **shadcn/ui** for beautiful, accessible components
- **Lucide** for clean, professional icons

---

**Built with ❤️ for office environments everywhere**

For questions, issues, or feature requests, please open an issue on the project repository.

