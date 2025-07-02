from flask import Blueprint, jsonify, request
import requests
from datetime import datetime

weather_bp = Blueprint('weather', __name__)

@weather_bp.route('/weather/current', methods=['GET'])
def get_current_weather():
    """
    Get current weather data from Open-Meteo API
    """
    try:
        # Default coordinates (can be made configurable)
        # Using San Francisco coordinates as example - should be configured for actual office location
        latitude = 37.7749
        longitude = -122.4194
        
        # Get coordinates from query parameters if provided
        lat = request.args.get('lat', latitude)
        lon = request.args.get('lon', longitude)
        
        # Open-Meteo API endpoint for current weather
        url = f"https://api.open-meteo.com/v1/forecast"
        params = {
            'latitude': lat,
            'longitude': lon,
            'current': 'temperature_2m,relative_humidity_2m,weather_code',
            'timezone': 'auto'
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        current = data.get('current', {})
        
        # Map weather codes to descriptions
        weather_code = current.get('weather_code', 0)
        weather_descriptions = {
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
        
        description = weather_descriptions.get(weather_code, 'Unknown')
        
        weather_data = {
            'temperature': round(current.get('temperature_2m', 0)),
            'humidity': round(current.get('relative_humidity_2m', 0)),
            'description': description,
            'weather_code': weather_code,
            'location': f'Lat: {lat}, Lon: {lon}',
            'last_updated': current.get('time', datetime.now().isoformat())
        }
        
        return jsonify({
            'weather': weather_data,
            'status': 'success'
        })
        
    except requests.exceptions.RequestException as e:
        return jsonify({
            'weather': None,
            'status': 'error',
            'message': f'Failed to fetch weather data: {str(e)}'
        }), 500
    except Exception as e:
        return jsonify({
            'weather': None,
            'status': 'error',
            'message': f'Unexpected error: {str(e)}'
        }), 500

