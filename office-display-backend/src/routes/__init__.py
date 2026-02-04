"""
Routes package for Office Display application
Contains all API endpoint blueprints
"""
from .user import user_bp
from .calendar import calendar_bp
from .weather import weather_bp

__all__ = ['user_bp', 'calendar_bp', 'weather_bp']
