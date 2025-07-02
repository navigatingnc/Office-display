import { useState, useEffect } from 'react'
import { Clock as ClockIcon } from 'lucide-react'

const Clock = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center gap-2 mb-4">
        <ClockIcon className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Office Display</h1>
      </div>
      
      <div className="text-6xl font-mono font-bold tracking-wider">
        {formatTime(time)}
      </div>
      
      <div className="text-xl text-muted-foreground">
        {formatDate(time)}
      </div>
    </div>
  )
}

export default Clock

