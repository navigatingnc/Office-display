"""
User model for Office Display application
Provides database schema and ORM for user management
"""
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    """
    User model representing office display users
    
    Attributes:
        id (int): Primary key, auto-incremented
        username (str): Unique username for the user
        email (str): User's email address
        created_at (datetime): Timestamp when user was created
        updated_at (datetime): Timestamp when user was last updated
    """
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        """String representation of User object"""
        return f'<User {self.username}>'
    
    def to_dict(self):
        """
        Convert User object to dictionary for JSON serialization
        
        Returns:
            dict: User data as dictionary
        """
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
