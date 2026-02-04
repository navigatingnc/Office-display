import { useState, useEffect } from 'react'
import { Cloud, Sun, CloudRain, Thermometer, Droplets } from 'lucide-react'

/**
 * WeatherDisplay Component
 * Displays current weather data from the backend API
 * Refreshes every 10 minutes to keep data current
 */
const WeatherDisplay = () => {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    /**
     * Fetch weather data from the backend API
     * Can pass lat/lon query parameters to override default location
     */
    const fetchWeather = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/weather/current')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setWeather(data.weather)
        setError(null)
      } catch (err) {
        console.error('Error fetching weather:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
    
    // Refresh weather every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  /**
   * Get appropriate weather icon based on description
   * @param {string} description - Weather description
   * @returns {JSX.Element} Weather icon component
   */
  const getWeatherIcon = (description) => {
    const desc = description?.toLowerCase() || ''
    
    if (desc.includes('rain') || desc.includes('shower') || desc.includes('drizzle')) {
      return <CloudRain className="h-12 w-12 text-blue-500" />
    } else if (desc.includes('cloud') || desc.includes('overcast')) {
      return <Cloud className="h-12 w-12 text-gray-500" />
    } else if (desc.includes('clear') || desc.includes('sunny')) {
      return <Sun className="h-12 w-12 text-yellow-500" />
    } else {
      return <Cloud className="h-12 w-12 text-gray-400" />
    }
  }

  /**
   * Format last updated timestamp
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted time string
   */
  const formatLastUpdated = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-full">
        <div className="flex items-center gap-2 mb-4">
          <Cloud className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Current Weather</h2>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-full">
        <div className="flex items-center gap-2 mb-4">
          <Cloud className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Current Weather</h2>
        </div>
        <div className="text-center text-gray-500">
          <p>Unable to load weather</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  // Weather display
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Cloud className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Current Weather</h2>
      </div>
      
      <div className="text-center space-y-4">
        {/* Weather icon */}
        <div className="flex items-center justify-center">
          {getWeatherIcon(weather?.description)}
        </div>
        
        {/* Temperature and description */}
        <div>
          <div className="text-4xl font-bold">{weather?.temperature}°C</div>
          <div className="text-lg text-gray-600 capitalize">
            {weather?.description}
          </div>
        </div>

        {/* Temperature and humidity details */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-red-500" />
            <div>
              <div className="text-sm text-gray-500">Temperature</div>
              <div className="font-semibold">{weather?.temperature}°C</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            <div>
              <div className="text-sm text-gray-500">Humidity</div>
              <div className="font-semibold">{weather?.humidity}%</div>
            </div>
          </div>
        </div>

        {/* Last updated timestamp */}
        <div className="text-xs text-gray-500 pt-4">
          Last updated: {formatLastUpdated(weather?.last_updated)}
        </div>
      </div>
    </div>
  )
}

export default WeatherDisplay
