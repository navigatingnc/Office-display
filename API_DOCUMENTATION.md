# Office Display API Documentation

Complete API reference for the Office Display backend application.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Currently, the API does not require authentication. For production deployments, consider implementing:
- JWT token-based authentication
- API key authentication
- OAuth 2.0

## Response Format

All responses are in JSON format with the following structure:

### Success Response
```json
{
  "status": "success",
  "data": {}
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description"
}
```

## HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `204 No Content`: Request successful, no content to return
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (e.g., duplicate)
- `500 Internal Server Error`: Server error

## Endpoints

### Health Check

#### Check API Health
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "message": "Office Display Backend is running"
}
```

**Status Code:** `200 OK`

---

### Calendar Events

#### Get Calendar Events
```http
GET /api/calendar/events
```

**Description:** Retrieve upcoming calendar events for the office display.

**Query Parameters:** None

**Response:**
```json
{
  "events": [
    {
      "id": "1",
      "title": "Team Meeting",
      "start": "2025-01-15T10:00:00",
      "end": "2025-01-15T11:00:00",
      "location": "Conference Room A",
      "description": "Weekly team sync-up meeting"
    },
    {
      "id": "2",
      "title": "Project Review",
      "start": "2025-01-15T14:00:00",
      "end": "2025-01-15T15:00:00",
      "location": "Conference Room B",
      "description": "Q1 project review and planning"
    }
  ],
  "status": "success",
  "message": "Using sample data - integrate Google Calendar API for production"
}
```

**Status Code:** `200 OK`

**Error Response:**
```json
{
  "events": [],
  "status": "error",
  "message": "Failed to fetch calendar events: [error details]"
}
```

**Status Code:** `500 Internal Server Error`

**Notes:**
- Currently returns sample data
- For production, integrate with Google Calendar API
- See `google_calendar.py` for integration instructions

---

### Weather

#### Get Current Weather
```http
GET /api/weather/current?lat=37.7749&lon=-122.4194
```

**Description:** Retrieve current weather data for specified coordinates.

**Query Parameters:**
- `lat` (optional, float): Latitude coordinate. Default: 37.7749 (San Francisco)
- `lon` (optional, float): Longitude coordinate. Default: -122.4194 (San Francisco)

**Response:**
```json
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
```

**Status Code:** `200 OK`

**Error Responses:**

Invalid coordinates:
```json
{
  "weather": null,
  "status": "error",
  "message": "Invalid latitude or longitude format. Must be numeric values."
}
```

**Status Code:** `400 Bad Request`

API error:
```json
{
  "weather": null,
  "status": "error",
  "message": "Failed to fetch weather data: [error details]"
}
```

**Status Code:** `500 Internal Server Error`

**Weather Codes:**
- `0`: Clear sky
- `1`: Mainly clear
- `2`: Partly cloudy
- `3`: Overcast
- `45`: Fog
- `48`: Depositing rime fog
- `51-55`: Drizzle
- `61-65`: Rain
- `71-75`: Snow
- `80-82`: Rain showers
- `95-99`: Thunderstorm

**Notes:**
- Uses Open-Meteo API (free, no API key required)
- Coordinates must be valid latitude (-90 to 90) and longitude (-180 to 180)
- Temperature is in Celsius
- Humidity is in percentage

---

### User Management

#### Get All Users
```http
GET /api/users
```

**Description:** Retrieve all users from the database.

**Response:**
```json
[
  {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "created_at": "2025-01-15T10:00:00",
    "updated_at": "2025-01-15T10:00:00"
  },
  {
    "id": 2,
    "username": "jane_smith",
    "email": "jane@example.com",
    "created_at": "2025-01-15T10:05:00",
    "updated_at": "2025-01-15T10:05:00"
  }
]
```

**Status Code:** `200 OK`

**Error Response:**
```json
{
  "status": "error",
  "message": "Failed to retrieve users"
}
```

**Status Code:** `500 Internal Server Error`

---

#### Create User
```http
POST /api/users
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com"
}
```

**Description:** Create a new user in the database.

**Request Body:**
- `username` (string, required): Unique username
- `email` (string, required): User's email address

**Response:**
```json
{
  "id": 3,
  "username": "john_doe",
  "email": "john@example.com",
  "created_at": "2025-01-15T10:30:00",
  "updated_at": "2025-01-15T10:30:00"
}
```

**Status Code:** `201 Created`

**Error Responses:**

Missing fields:
```json
{
  "status": "error",
  "message": "Missing required fields: username and email"
}
```

**Status Code:** `400 Bad Request`

Duplicate user:
```json
{
  "status": "error",
  "message": "User with this username or email already exists"
}
```

**Status Code:** `409 Conflict`

Server error:
```json
{
  "status": "error",
  "message": "Failed to create user"
}
```

**Status Code:** `500 Internal Server Error`

---

#### Get User by ID
```http
GET /api/users/{user_id}
```

**Description:** Retrieve a specific user by ID.

**Path Parameters:**
- `user_id` (integer, required): User ID

**Response:**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "created_at": "2025-01-15T10:00:00",
  "updated_at": "2025-01-15T10:00:00"
}
```

**Status Code:** `200 OK`

**Error Response:**
```json
{
  "status": "error",
  "message": "User with ID 999 not found"
}
```

**Status Code:** `404 Not Found`

---

#### Update User
```http
PUT /api/users/{user_id}
Content-Type: application/json

{
  "username": "jane_doe",
  "email": "jane@example.com"
}
```

**Description:** Update an existing user.

**Path Parameters:**
- `user_id` (integer, required): User ID

**Request Body:**
- `username` (string, optional): New username
- `email` (string, optional): New email

**Response:**
```json
{
  "id": 1,
  "username": "jane_doe",
  "email": "jane@example.com",
  "created_at": "2025-01-15T10:00:00",
  "updated_at": "2025-01-15T10:35:00"
}
```

**Status Code:** `200 OK`

**Error Responses:**

User not found:
```json
{
  "status": "error",
  "message": "User with ID 999 not found"
}
```

**Status Code:** `404 Not Found`

Duplicate username/email:
```json
{
  "status": "error",
  "message": "Username already exists"
}
```

**Status Code:** `409 Conflict`

---

#### Delete User
```http
DELETE /api/users/{user_id}
```

**Description:** Delete a user from the database.

**Path Parameters:**
- `user_id` (integer, required): User ID

**Response:** Empty response body

**Status Code:** `204 No Content`

**Error Response:**
```json
{
  "status": "error",
  "message": "User with ID 999 not found"
}
```

**Status Code:** `404 Not Found`

---

## Error Handling

### Common Error Scenarios

#### Invalid JSON
```http
POST /api/users
Content-Type: application/json

{invalid json}
```

**Response:**
```json
{
  "status": "error",
  "message": "Invalid JSON in request body"
}
```

**Status Code:** `400 Bad Request`

#### Timeout
```json
{
  "weather": null,
  "status": "error",
  "message": "Weather service request timed out. Please try again."
}
```

**Status Code:** `500 Internal Server Error`

#### Connection Error
```json
{
  "weather": null,
  "status": "error",
  "message": "Failed to connect to weather service. Please check your internet connection."
}
```

**Status Code:** `500 Internal Server Error`

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production deployments, consider implementing:
- Request rate limiting (e.g., 100 requests per minute)
- IP-based throttling
- User-based quotas

---

## CORS Configuration

The API is configured with CORS enabled for all routes. For production, restrict CORS to specific origins:

```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://yourdomain.com"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type"]
    }
})
```

---

## Examples

### Using cURL

Get weather:
```bash
curl -X GET "http://localhost:5000/api/weather/current?lat=40.7128&lon=-74.0060"
```

Create user:
```bash
curl -X POST "http://localhost:5000/api/users" \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "email": "john@example.com"}'
```

### Using JavaScript Fetch

Get calendar events:
```javascript
fetch('/api/calendar/events')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error))
```

Get weather:
```javascript
fetch('/api/weather/current?lat=37.7749&lon=-122.4194')
  .then(response => response.json())
  .then(data => console.log(data.weather))
  .catch(error => console.error('Error:', error))
```

### Using Python Requests

```python
import requests

# Get weather
response = requests.get('http://localhost:5000/api/weather/current')
print(response.json())

# Create user
data = {
    'username': 'john_doe',
    'email': 'john@example.com'
}
response = requests.post('http://localhost:5000/api/users', json=data)
print(response.json())
```

---

## Versioning

Current API version: **1.0.0**

Future versions will maintain backward compatibility where possible. Breaking changes will be documented in release notes.

---

## Support

For API issues or questions:
1. Check this documentation
2. Review the README.md
3. Open an issue on GitHub
4. Contact the development team

---

**Last Updated:** January 2025
