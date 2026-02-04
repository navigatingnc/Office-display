# Contributing to Office Display

Thank you for your interest in contributing to the Office Display project! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Office-display.git
cd Office-display

# Add upstream remote
git remote add upstream https://github.com/navigatingnc/Office-display.git
```

### 2. Create a Feature Branch

```bash
# Update main branch
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
```

### 3. Set Up Development Environment

#### Backend Setup

```bash
cd office-display-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# OR
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Run backend
python main.py
```

#### Frontend Setup

```bash
cd office-display-frontend

# Install dependencies
npm install
# or
pnpm install

# Copy environment file
cp .env.example .env.local

# Run development server
npm run dev
# or
pnpm dev
```

## Development Workflow

### Backend Development

#### Code Style
- Follow PEP 8 guidelines
- Use meaningful variable and function names
- Add docstrings to functions and classes
- Keep functions focused and single-purpose

#### Adding New Features

1. **Create a new route** in `src/routes/`:
```python
from flask import Blueprint, jsonify, request
import logging

logger = logging.getLogger(__name__)
feature_bp = Blueprint('feature', __name__)

@feature_bp.route('/feature/endpoint', methods=['GET'])
def get_feature():
    """
    Get feature data
    
    Returns:
        JSON: Feature data
        Status: 200 on success, 500 on error
    """
    try:
        # Implementation
        logger.info("Feature endpoint called")
        return jsonify({'status': 'success', 'data': []}), 200
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500
```

2. **Register the blueprint** in `main.py`:
```python
from src.routes.feature import feature_bp
app.register_blueprint(feature_bp, url_prefix='/api')
```

3. **Add tests** for your endpoint

#### Database Changes

1. **Update schema** in `src/models/`:
```python
class Feature(db.Model):
    __tablename__ = 'features'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    
    def to_dict(self):
        return {'id': self.id, 'name': self.name}
```

2. **Create migration** if using Alembic (optional for SQLite)

3. **Update database initialization** in `main.py`

### Frontend Development

#### Code Style
- Use functional components with hooks
- Use meaningful component and variable names
- Add JSDoc comments for complex functions
- Keep components focused and reusable

#### Adding New Components

1. **Create component file** in `src/components/`:
```jsx
import { useState, useEffect } from 'react'

/**
 * FeatureComponent
 * Description of what this component does
 */
const FeatureComponent = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/feature/endpoint')
        if (!response.ok) throw new Error('Failed to fetch')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return <div>{/* Component JSX */}</div>
}

export default FeatureComponent
```

2. **Export from components/index.js**:
```javascript
export { default as FeatureComponent } from './FeatureComponent'
```

3. **Use in App.jsx** or other components

#### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow the existing color scheme
- Ensure responsive design (mobile-first)
- Test on different screen sizes

## Testing

### Backend Testing

```bash
cd office-display-backend

# Run tests
pytest

# Run with coverage
pytest --cov=src

# Run specific test
pytest tests/test_weather.py
```

### Frontend Testing

```bash
cd office-display-frontend

# Run tests
npm run test
# or
pnpm test

# Run with coverage
npm run test -- --coverage
```

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, etc.

### Examples

```
feat(weather): add temperature unit conversion

Add support for Celsius/Fahrenheit conversion in weather display.
Users can now toggle between temperature units in settings.

Closes #123
```

```
fix(calendar): handle timezone differences

Fixed issue where calendar events were displaying incorrect times
for users in different timezones.

Fixes #456
```

## Pull Request Process

1. **Update your branch** with latest upstream changes:
```bash
git fetch upstream
git rebase upstream/main
```

2. **Push to your fork**:
```bash
git push origin feature/your-feature-name
```

3. **Create Pull Request** on GitHub with:
   - Clear title and description
   - Reference to related issues
   - Screenshots for UI changes
   - Testing instructions

4. **Respond to feedback** and make requested changes

5. **Ensure CI passes** (if applicable)

## Documentation

### Code Comments
- Explain the "why", not the "what"
- Use clear, concise language
- Add examples for complex logic

### API Documentation
- Document all endpoints in README.md
- Include request/response examples
- Document error codes and messages
- Add query parameters and headers

### README Updates
- Update README.md for new features
- Add setup instructions if needed
- Update project structure diagram if changed

## Performance Considerations

### Backend
- Minimize database queries
- Use caching for frequently accessed data
- Optimize API response times
- Monitor resource usage

### Frontend
- Lazy load components when possible
- Optimize re-renders
- Minimize bundle size
- Use efficient data structures

## Security Considerations

- Never commit secrets or API keys
- Validate all user inputs
- Use environment variables for configuration
- Follow OWASP guidelines
- Keep dependencies updated

## Deployment

### Staging Deployment

```bash
# Build frontend
cd office-display-frontend
npm run build

# Test production build
npm run preview
```

### Production Deployment

1. **Test thoroughly** in staging
2. **Create release branch**:
```bash
git checkout -b release/v1.0.0
```

3. **Update version** in package.json and setup.py
4. **Update CHANGELOG**
5. **Create tag**:
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push upstream v1.0.0
```

6. **Deploy** to production

## Reporting Issues

### Bug Reports
- Use clear, descriptive title
- Provide step-by-step reproduction
- Include environment details (OS, browser, versions)
- Attach screenshots or logs if relevant

### Feature Requests
- Describe the feature and use case
- Explain why it's needed
- Provide examples or mockups if possible

## Questions?

- Check existing issues and PRs
- Read the README and documentation
- Ask in GitHub discussions
- Contact the maintainers

## Recognition

Contributors will be recognized in:
- Project README
- Release notes
- GitHub contributors page

Thank you for contributing to Office Display! 🎉
