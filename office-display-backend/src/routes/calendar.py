"""
Calendar API routes for Office Display application
Handles calendar event endpoints with Google Calendar API integration
"""
from flask import Blueprint, jsonify
from datetime import datetime, timedelta
import logging

# Configure logger
logger = logging.getLogger(__name__)

calendar_bp = Blueprint('calendar', __name__)


@calendar_bp.route('/calendar/events', methods=['GET'])
def get_calendar_events():
    """
    Get calendar events for the office display
    
    Returns:
        JSON: List of upcoming calendar events
        Status: 200 on success, 500 on error
    
    Note:
        Currently returns sample data. For production, integrate with Google Calendar API
        by setting up service account credentials and implementing the actual API calls.
        See google_calendar.py for integration documentation.
    """
    try:
        # TODO: Replace with actual Google Calendar API integration
        # This is placeholder data for demonstration purposes
        sample_events = [
            {
                'id': '1',
                'title': 'Team Meeting',
                'start': (datetime.now() + timedelta(hours=1)).isoformat(),
                'end': (datetime.now() + timedelta(hours=2)).isoformat(),
                'location': 'Conference Room A',
                'description': 'Weekly team sync-up meeting'
            },
            {
                'id': '2',
                'title': 'Project Review',
                'start': (datetime.now() + timedelta(hours=3)).isoformat(),
                'end': (datetime.now() + timedelta(hours=4)).isoformat(),
                'location': 'Conference Room B',
                'description': 'Q1 project review and planning'
            },
            {
                'id': '3',
                'title': 'Client Presentation',
                'start': (datetime.now() + timedelta(hours=5)).isoformat(),
                'end': (datetime.now() + timedelta(hours=6)).isoformat(),
                'location': 'Main Office',
                'description': 'Presentation to key stakeholders'
            }
        ]
        
        logger.info(f"Retrieved {len(sample_events)} calendar events")
        return jsonify({
            'events': sample_events,
            'status': 'success',
            'message': 'Using sample data - integrate Google Calendar API for production'
        }), 200
        
    except Exception as e:
        logger.error(f"Error retrieving calendar events: {str(e)}")
        return jsonify({
            'events': [],
            'status': 'error',
            'message': f'Failed to fetch calendar events: {str(e)}'
        }), 500
