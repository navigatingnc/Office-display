import { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin } from 'lucide-react'

const CalendarEvents = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/calendar/events')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setEvents(data.events || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching calendar events:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
    
    // Refresh events every 5 minutes
    const interval = setInterval(fetchEvents, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg shadow-lg p-8 h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg shadow-lg p-8 h-full flex items-center justify-center">
        <Calendar className="h-16 w-16 text-white opacity-50" />
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="bg-gradient-to-br from-purple-300 to-purple-400 rounded-lg shadow-lg p-8 h-full flex items-center justify-center">
        <Calendar className="h-16 w-16 text-white opacity-50" />
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg shadow-lg p-6 h-full overflow-y-auto">
      <div className="space-y-3">
        {events.slice(0, 5).map((event) => (
          <div key={event.id} className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-4 text-white">
            <h3 className="font-bold text-lg">{event.title}</h3>
            <div className="flex flex-col gap-2 text-sm mt-2 opacity-90">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{formatDate(event.start)} {formatTime(event.start)}</span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CalendarEvents
