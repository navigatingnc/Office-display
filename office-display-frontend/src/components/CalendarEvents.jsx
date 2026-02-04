import { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin } from 'lucide-react'

/**
 * CalendarEvents Component
 * Displays upcoming calendar events from the backend API
 * Refreshes every 5 minutes to keep data current
 */
const CalendarEvents = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    /**
     * Fetch calendar events from the backend API
     */
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

  /**
   * Format time in 12-hour format
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted time string
   */
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  /**
   * Format date with abbreviated day and month
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-full">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Upcoming Events</h2>
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
          <Calendar className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Upcoming Events</h2>
        </div>
        <div className="text-center text-gray-500">
          <p>Unable to load events</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  // Empty state
  if (events.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-full">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Upcoming Events</h2>
        </div>
        <div className="text-center text-gray-500 py-8">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No upcoming events</p>
        </div>
      </div>
    )
  }

  // Events list
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Upcoming Events</h2>
      </div>
      
      <div className="space-y-4">
        {events.slice(0, 5).map((event) => (
          <div key={event.id} className="border-l-4 border-blue-500 pl-4 py-2">
            <h3 className="font-semibold text-lg">{event.title}</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-600 mt-1">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatDate(event.start)} at {formatTime(event.start)}</span>
              </div>
              {event.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              )}
              {event.description && (
                <p className="text-xs text-gray-500 mt-1">{event.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CalendarEvents
