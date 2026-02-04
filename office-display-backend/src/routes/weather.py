"""
Weather API routes for Office Display application
Fetches real-time weather data from Open-Meteo API
"""
from flask import Blueprint, jsonify, request
import requests
from datetime import datetime
import logging

# Configure logger
logger = logging.getLogger(__name__)

weather_bp = Blueprint('weather', __name__)

# Weather code to description mapping (WMO Weather interpretation codes)
WEATHER_DESCRIPTIONS = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
}


@weather_bp.route('/weather/current', methods=['GET'])
def get_current_weather():
    """
    Get current weather data from Open-Meteo API
    
    Query Parameters:
        lat (float, optional): Latitude coordinate (default: 37.7749 - San Francisco)
        lon (float, optional): Longitude coordinate (default: -122.4194 - San Francisco)
    
    Returns:
        JSON: Current weather data including temperature, humidity, and description
        Status: 200 on success, 400 on invalid parameters, 500 on API error
    
    Example Response:
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
    """
    try:
        # Default coordinates (San Francisco) - should be configured for actual office location
        default_latitude = 37.7749
        default_longitude = -122.4194
        
        # Get coordinates from query parameters if provided
        try:
            lat = float(request.args.get('lat', default_latitude))
            lon = float(request.args.get('lon', default_longitude))
        except ValueError:
            logger.warning(f"Invalid coordinates provided: lat={request.args.get('lat')}, lon={request.args.get('lon')}")
            return jsonify({
                'weather': None,
                'status': 'error',
                'message': 'Invalid latitude or longitude format. Must be numeric values.'
            }), 400
        
        # Validate coordinate ranges
        if not (-90 <= lat <= 90) or not (-180 <= lon <= 180):
            logger.warning(f"Coordinates out of range: lat={lat}, lon={lon}")
            return jsonify({
                'weather': None,
                'status': 'error',
                'message': 'Invalid coordinates. Latitude must be -90 to 90, longitude must be -180 to 180.'
            }), 400
        
        # Open-Meteo API endpoint for current weather
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            'latitude': lat,
            'longitude': lon,
            'current': 'temperature_2m,relative_humidity_2m,weather_code',
            'timezone': 'auto'
        }
        
        logger.info(f"Fetching weather data for coordinates: lat={lat}, lon={lon}")
        
        # Make API request with timeout
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        current = data.get('current', {})
        
        # Extract weather code and get description
        weather_code = current.get('weather_code', 0)
        description = WEATHER_DESCRIPTIONS.get(weather_code, 'Unknown')
        
        # Build response
        weather_data = {
            'temperature': round(current.get('temperature_2m', 0)),
            'humidity': round(current.get('relative_humidity_2m', 0)),
            'description': description,
            'weather_code': weather_code,
            'location': f'Lat: {lat}, Lon: {lon}',
            'last_updated': current.get('time', datetime.now().isoformat())
        }
        
        logger.info(f"Successfully retrieved weather: {description}, {weather_data['temperature']}°C")
        
        return jsonify({
            'weather': weather_data,
            'status': 'success'
        }), 200
        
    except requests.exceptions.Timeout:
        logger.error("Weather API request timeout")
        return jsonify({
            'weather': None,
            'status': 'error',
            'message': 'Weather service request timed out. Please try again.'
        }), 500
    
    except requests.exceptions.ConnectionError:
        logger.error("Weather API connection error")
        return jsonify({
            'weather': None,
            'status': 'error',
            'message': 'Failed to connect to weather service. Please check your internet connection.'
        }), 500
    
    except requests.exceptions.HTTPError as e:
        logger.error(f"Weather API HTTP error: {str(e)}")
        return jsonify({
            'weather': None,
            'status': 'error',
            'message': f'Weather service returned an error: {str(e)}'
        }), 500
    
    except requests.exceptions.RequestException as e:
        logger.error(f"Weather API request error: {str(e)}")
        return jsonify({
            'weather': None,
            'status': 'error',
            'message': f'Failed to fetch weather data: {str(e)}'
        }), 500
    
    except Exception as e:
        logger.error(f"Unexpected error in weather endpoint: {str(e)}")
        return jsonify({
            'weather': None,
            'status': 'error',
            'message': f'Unexpected error: {str(e)}'
        }), 500
