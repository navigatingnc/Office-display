"""
Office Display Backend Application
Main entry point for the Flask application
"""
import os
import sys
import logging
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.routes.user import user_bp
from src.routes.calendar import calendar_bp
from src.routes.weather import weather_bp

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(
    __name__,
    static_folder=os.path.join(os.path.dirname(__file__), 'static')
)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'asdf#FGSgvasgf$5$WGT')
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JSON_SORT_KEYS'] = False

# Enable CORS for all routes
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize database
db.init_app(app)

# Register blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(calendar_bp, url_prefix='/api')
app.register_blueprint(weather_bp, url_prefix='/api')


@app.before_request
def create_tables():
    """Create database tables if they don't exist"""
    db.create_all()


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """
    Serve static files and fallback to index.html for SPA routing
    """
    static_folder_path = app.static_folder
    
    if static_folder_path is None:
        logger.error("Static folder not configured")
        return "Static folder not configured", 404
    
    # Try to serve the requested file
    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    
    # Fallback to index.html for SPA routing
    index_path = os.path.join(static_folder_path, 'index.html')
    if os.path.exists(index_path):
        return send_from_directory(static_folder_path, 'index.html')
    
    logger.warning(f"Requested path not found: {path}")
    return "index.html not found", 404


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    logger.warning(f"404 error: {error}")
    return {
        'status': 'error',
        'message': 'Resource not found'
    }, 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f"500 error: {error}")
    return {
        'status': 'error',
        'message': 'Internal server error'
    }, 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint for monitoring
    
    Returns:
        JSON: Health status
    """
    return {
        'status': 'healthy',
        'message': 'Office Display Backend is running'
    }, 200


if __name__ == '__main__':
    # Create database directory if it doesn't exist
    db_dir = os.path.join(os.path.dirname(__file__), 'database')
    os.makedirs(db_dir, exist_ok=True)
    
    # Get host and port from environment or use defaults
    host = os.environ.get('FLASK_HOST', '0.0.0.0')
    port = int(os.environ.get('FLASK_PORT', 5000))
    debug = os.environ.get('FLASK_ENV', 'development') == 'development'
    
    logger.info(f"Starting Office Display Backend on {host}:{port}")
    logger.info(f"Debug mode: {debug}")
    
    app.run(host=host, port=port, debug=debug)
