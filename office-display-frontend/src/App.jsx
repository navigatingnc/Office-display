import { useEffect } from 'react'
import Clock from './components/Clock'
import CalendarEvents from './components/CalendarEvents'
import WeatherDisplay from './components/WeatherDisplay'
import './App.css'

/**
 * Main App Component
 * Layout and orchestration of the office display application
 * Handles fullscreen mode toggle with F11 key
 */
function App() {
  useEffect(() => {
    /**
     * Request fullscreen on component mount for kiosk mode
     */
    const requestFullscreen = () => {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.warn('Fullscreen request failed:', err)
        })
      }
    }

    /**
     * Handle F11 key press to toggle fullscreen mode
     */
    const handleKeyPress = (event) => {
      if (event.key === 'F11') {
        event.preventDefault()
        if (document.fullscreenElement) {
          document.exitFullscreen()
        } else {
          requestFullscreen()
        }
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto h-screen flex flex-col">
        {/* Header with Clock */}
        <div className="mb-8">
          <Clock />
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar Events */}
          <div className="lg:col-span-1">
            <CalendarEvents />
          </div>

          {/* Weather Display */}
          <div className="lg:col-span-1">
            <WeatherDisplay />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Press F11 for fullscreen mode • Updates automatically</p>
        </div>
      </div>
    </div>
  )
}

export default App
