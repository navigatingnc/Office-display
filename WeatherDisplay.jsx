import { useState, useEffect } from 'react'
import { Cloud, Sun, CloudRain, Thermometer, Droplets } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const WeatherDisplay = () => {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('/api/weather/current')
        if (!response.ok) {
          throw new Error('Failed to fetch weather')
        }
        const data = await response.json()
        setWeather(data.weather)
      } catch (err) {
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

  const getWeatherIcon = (description) => {
    const desc = description?.toLowerCase() || ''
    if (desc.includes('rain') || desc.includes('shower')) {
      return <CloudRain className="h-12 w-12 text-blue-500" />
    } else if (desc.includes('cloud')) {
      return <Cloud className="h-12 w-12 text-gray-500" />
    } else {
      return <Sun className="h-12 w-12 text-yellow-500" />
    }
  }

  const formatLastUpdated = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-6 w-6" />
            Current Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-6 w-6" />
            Current Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            <p>Unable to load weather</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-6 w-6" />
          Current Weather
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            {getWeatherIcon(weather.description)}
          </div>
          
          <div>
            <div className="text-4xl font-bold">{weather.temperature}°C</div>
            <div className="text-lg text-muted-foreground capitalize">
              {weather.description}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-red-500" />
              <div>
                <div className="text-sm text-muted-foreground">Temperature</div>
                <div className="font-semibold">{weather.temperature}°C</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-sm text-muted-foreground">Humidity</div>
                <div className="font-semibold">{weather.humidity}%</div>
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground pt-4">
            Last updated: {formatLastUpdated(weather.last_updated)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default WeatherDisplay

