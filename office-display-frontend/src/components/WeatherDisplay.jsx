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



  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg shadow-lg p-8 h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg shadow-lg p-8 h-full flex items-center justify-center">
        <Cloud className="h-16 w-16 text-white opacity-50" />
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg shadow-lg p-8 h-full flex flex-col items-center justify-center text-white">
      <div className="flex items-center justify-center mb-6">
        {getWeatherIcon(weather?.description)}
      </div>
      <div className="text-5xl font-bold">{weather?.temperature}°C</div>
      <div className="text-lg capitalize opacity-90 mt-2">{weather?.description}</div>
      <div className="flex gap-8 mt-8 text-sm">
        <div className="flex flex-col items-center">
          <Thermometer className="h-6 w-6 mb-1" />
          <span>{weather?.temperature}°</span>
        </div>
        <div className="flex flex-col items-center">
          <Droplets className="h-6 w-6 mb-1" />
          <span>{weather?.humidity}%</span>
        </div>
      </div>
    </div>
  )
}

export default WeatherDisplay
