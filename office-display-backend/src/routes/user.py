"""
User API routes for Office Display application
Handles user management endpoints (CRUD operations)
"""
from flask import Blueprint, jsonify, request
from src.models.user import User, db
import logging

# Configure logger
logger = logging.getLogger(__name__)

user_bp = Blueprint('user', __name__)


@user_bp.route('/users', methods=['GET'])
def get_users():
    """
    Get all users from the database
    
    Returns:
        JSON: List of all users
        Status: 200 on success, 500 on error
    """
    try:
        users = User.query.all()
        logger.info(f"Retrieved {len(users)} users")
        return jsonify([user.to_dict() for user in users]), 200
    except Exception as e:
        logger.error(f"Error retrieving users: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to retrieve users'
        }), 500


@user_bp.route('/users', methods=['POST'])
def create_user():
    """
    Create a new user
    
    Request JSON:
        username (str): Unique username
        email (str): User email address
    
    Returns:
        JSON: Created user data
        Status: 201 on success, 400 on validation error, 409 on duplicate, 500 on error
    """
    try:
        data = request.json
        
        # Validate required fields
        if not data or not data.get('username') or not data.get('email'):
            logger.warning("Create user request missing required fields")
            return jsonify({
                'status': 'error',
                'message': 'Missing required fields: username and email'
            }), 400
        
        # Check for existing user
        existing_user = User.query.filter(
            (User.username == data['username']) | (User.email == data['email'])
        ).first()
        
        if existing_user:
            logger.warning(f"Attempt to create duplicate user: {data['username']}")
            return jsonify({
                'status': 'error',
                'message': 'User with this username or email already exists'
            }), 409
        
        # Create new user
        user = User(username=data['username'], email=data['email'])
        db.session.add(user)
        db.session.commit()
        
        logger.info(f"Created new user: {user.username}")
        return jsonify(user.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating user: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to create user'
        }), 500


@user_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """
    Get a specific user by ID
    
    Args:
        user_id (int): User ID
    
    Returns:
        JSON: User data
        Status: 200 on success, 404 if not found, 500 on error
    """
    try:
        user = User.query.get(user_id)
        
        if not user:
            logger.warning(f"User not found: {user_id}")
            return jsonify({
                'status': 'error',
                'message': f'User with ID {user_id} not found'
            }), 404
        
        logger.info(f"Retrieved user: {user.username}")
        return jsonify(user.to_dict()), 200
        
    except Exception as e:
        logger.error(f"Error retrieving user {user_id}: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to retrieve user'
        }), 500


@user_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """
    Update a specific user
    
    Args:
        user_id (int): User ID
    
    Request JSON:
        username (str, optional): New username
        email (str, optional): New email
    
    Returns:
        JSON: Updated user data
        Status: 200 on success, 404 if not found, 409 on duplicate, 500 on error
    """
    try:
        user = User.query.get(user_id)
        
        if not user:
            logger.warning(f"User not found for update: {user_id}")
            return jsonify({
                'status': 'error',
                'message': f'User with ID {user_id} not found'
            }), 404
        
        data = request.json
        
        # Check for duplicate username if updating
        if 'username' in data and data['username'] != user.username:
            existing = User.query.filter_by(username=data['username']).first()
            if existing:
                logger.warning(f"Duplicate username in update: {data['username']}")
                return jsonify({
                    'status': 'error',
                    'message': 'Username already exists'
                }), 409
            user.username = data['username']
        
        # Check for duplicate email if updating
        if 'email' in data and data['email'] != user.email:
            existing = User.query.filter_by(email=data['email']).first()
            if existing:
                logger.warning(f"Duplicate email in update: {data['email']}")
                return jsonify({
                    'status': 'error',
                    'message': 'Email already exists'
                }), 409
            user.email = data['email']
        
        db.session.commit()
        logger.info(f"Updated user: {user.username}")
        return jsonify(user.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating user {user_id}: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to update user'
        }), 500


@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """
    Delete a specific user
    
    Args:
        user_id (int): User ID
    
    Returns:
        JSON: Success message
        Status: 204 on success, 404 if not found, 500 on error
    """
    try:
        user = User.query.get(user_id)
        
        if not user:
            logger.warning(f"User not found for deletion: {user_id}")
            return jsonify({
                'status': 'error',
                'message': f'User with ID {user_id} not found'
            }), 404
        
        db.session.delete(user)
        db.session.commit()
        logger.info(f"Deleted user: {user.username}")
        return '', 204
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error deleting user {user_id}: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to delete user'
        }), 500
