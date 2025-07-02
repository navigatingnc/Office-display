# Quick Setup Guide

This guide will get you up and running with the Office Display application in under 10 minutes.

## Prerequisites Check

Before starting, ensure you have:
- [ ] Node.js (v20+) - `node --version`
- [ ] Python (v3.11+) - `python --version`
- [ ] npm or pnpm - `npm --version`

## 5-Minute Setup

### Step 1: Backend Setup (2 minutes)

```bash
# Navigate to backend
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
python src/main.py
```

✅ Backend should be running at `http://localhost:5000`

### Step 2: Frontend Setup (2 minutes)

Open a new terminal:

```bash
# Navigate to frontend
cd office-display-frontend

# Install dependencies
pnpm install  # or npm install

# Start development server
pnpm run dev --host  # or npm run dev -- --host
```

✅ Frontend should be running at `http://localhost:5174`

### Step 3: Test the Application (1 minute)

1. Open your browser to `http://localhost:5174`
2. You should see:
   - Real-time clock at the top
   - Sample calendar events on the left
   - Live weather data on the right
3. Press **F11** for fullscreen mode

## Verification Checklist

- [ ] Clock updates every second
- [ ] Weather shows real data (temperature, humidity, description)
- [ ] Calendar shows sample events
- [ ] Fullscreen mode works (F11)
- [ ] Page is responsive (try resizing browser)

## Next Steps

- **Customize location**: Edit coordinates in `office-display-backend/src/routes/weather.py`
- **Add Google Calendar**: Follow the Google Calendar integration guide in README.md
- **Deploy**: See deployment section in README.md for production setup

## Troubleshooting

**Problem**: Frontend shows "Unable to load" errors
**Solution**: Ensure backend is running on port 5000

**Problem**: Weather not loading
**Solution**: Check internet connection and try refreshing

**Problem**: Can't enter fullscreen
**Solution**: Click on the page first, then press F11

## Support

For detailed documentation, see [README.md](README.md)
For issues, check the troubleshooting section in the main README.

