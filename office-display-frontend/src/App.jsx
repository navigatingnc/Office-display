import { useEffect } from 'react'
import Clock from './components/Clock'
import CalendarEvents from './components/CalendarEvents'
import WeatherDisplay from './components/WeatherDisplay'
import './App.css'

function App() {
  useEffect(() => {
    const requestFullscreen = () => {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.warn('Fullscreen request failed:', err)
        })
      }
    }

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-7xl mx-auto h-screen flex flex-col">
        <div className="mb-6">
          <Clock />
        </div>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CalendarEvents />
          <WeatherDisplay />
        </div>
      </div>
    </div>
  )
}

export default App
