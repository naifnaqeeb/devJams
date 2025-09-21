"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, ExternalLink, RefreshCw, CheckCircle, AlertCircle, Clock, MapPin } from "lucide-react"

interface GoogleCalendarEvent {
  id: string
  summary: string
  description?: string
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  location?: string
  attendees?: Array<{
    email: string
    displayName?: string
    responseStatus: string
  }>
  status: string
  htmlLink: string
}

interface GoogleCalendarIntegrationProps {
  userType: "user" | "client"
  onEventSync?: (events: GoogleCalendarEvent[]) => void
}

export function GoogleCalendarIntegration({ userType, onEventSync }: GoogleCalendarIntegrationProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([])
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle")

  // Simulate Google Calendar connection status
  useEffect(() => {
    // In a real implementation, this would check actual Google Calendar connection
    const checkConnection = async () => {
      setIsLoading(true)
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsConnected(true)
      setIsLoading(false)
      loadMockEvents()
    }

    checkConnection()
  }, [])

  const loadMockEvents = () => {
    const mockEvents: GoogleCalendarEvent[] = [
      // Current appointments
      {
        id: "1",
        summary: "Hair Appointment - Sarah Johnson",
        description: "Scheduled via ScheduleAI",
        start: {
          dateTime: "2024-01-15T10:00:00",
          timeZone: "America/New_York",
        },
        end: {
          dateTime: "2024-01-15T11:30:00",
          timeZone: "America/New_York",
        },
        location: "Downtown Salon",
        attendees: [
          {
            email: "sarah.j@email.com",
            displayName: "Sarah Johnson",
            responseStatus: "accepted",
          },
        ],
        status: "confirmed",
        htmlLink: "https://calendar.google.com/event?eid=example1",
      },
      {
        id: "2",
        summary: "Dental Checkup - Michael Chen",
        description: "Scheduled via ScheduleAI",
        start: {
          dateTime: "2024-01-15T14:30:00",
          timeZone: "America/New_York",
        },
        end: {
          dateTime: "2024-01-15T15:30:00",
          timeZone: "America/New_York",
        },
        location: "City Dental Care",
        attendees: [
          {
            email: "m.chen@email.com",
            displayName: "Michael Chen",
            responseStatus: "accepted",
          },
        ],
        status: "confirmed",
        htmlLink: "https://calendar.google.com/event?eid=example2",
      },
      {
        id: "3",
        summary: "Massage Therapy - Emma Davis",
        description: "Scheduled via ScheduleAI - Deep tissue massage requested",
        start: {
          dateTime: "2024-01-16T16:00:00",
          timeZone: "America/New_York",
        },
        end: {
          dateTime: "2024-01-16T17:15:00",
          timeZone: "America/New_York",
        },
        location: "Wellness Center",
        attendees: [
          {
            email: "emma.davis@email.com",
            displayName: "Emma Davis",
            responseStatus: "needsAction",
          },
        ],
        status: "tentative",
        htmlLink: "https://calendar.google.com/event?eid=example3",
      },
      // Additional events for comprehensive calendar coverage
      {
        id: "4",
        summary: "Team Meeting",
        description: "Weekly team sync meeting",
        start: {
          dateTime: "2024-01-22T09:00:00",
          timeZone: "America/New_York",
        },
        end: {
          dateTime: "2024-01-22T10:00:00",
          timeZone: "America/New_York",
        },
        location: "Conference Room A",
        attendees: [
          {
            email: "team@company.com",
            displayName: "Team",
            responseStatus: "accepted",
          },
        ],
        status: "confirmed",
        htmlLink: "https://calendar.google.com/event?eid=example4",
      },
      {
        id: "5",
        summary: "Client Consultation - Alex Rodriguez",
        description: "Initial consultation for new client",
        start: {
          dateTime: "2024-01-23T11:00:00",
          timeZone: "America/New_York",
        },
        end: {
          dateTime: "2024-01-23T12:00:00",
          timeZone: "America/New_York",
        },
        location: "Office",
        attendees: [
          {
            email: "alex.r@email.com",
            displayName: "Alex Rodriguez",
            responseStatus: "accepted",
          },
        ],
        status: "confirmed",
        htmlLink: "https://calendar.google.com/event?eid=example5",
      },
      {
        id: "6",
        summary: "Fitness Training - Maria Garcia",
        description: "Personal training session",
        start: {
          dateTime: "2024-01-24T08:00:00",
          timeZone: "America/New_York",
        },
        end: {
          dateTime: "2024-01-24T09:00:00",
          timeZone: "America/New_York",
        },
        location: "Gym",
        attendees: [
          {
            email: "maria.g@email.com",
            displayName: "Maria Garcia",
            responseStatus: "accepted",
          },
        ],
        status: "confirmed",
        htmlLink: "https://calendar.google.com/event?eid=example6",
      },
      {
        id: "7",
        summary: "Beauty Treatment - Jennifer Lee",
        description: "Facial and skincare treatment",
        start: {
          dateTime: "2024-01-25T13:30:00",
          timeZone: "America/New_York",
        },
        end: {
          dateTime: "2024-01-25T15:00:00",
          timeZone: "America/New_York",
        },
        location: "Beauty Spa",
        attendees: [
          {
            email: "jennifer.l@email.com",
            displayName: "Jennifer Lee",
            responseStatus: "accepted",
          },
        ],
        status: "confirmed",
        htmlLink: "https://calendar.google.com/event?eid=example7",
      },
      {
        id: "8",
        summary: "Business Review Meeting",
        description: "Monthly business performance review",
        start: {
          dateTime: "2024-01-26T15:00:00",
          timeZone: "America/New_York",
        },
        end: {
          dateTime: "2024-01-26T16:30:00",
          timeZone: "America/New_York",
        },
        location: "Main Office",
        attendees: [
          {
            email: "manager@company.com",
            displayName: "Manager",
            responseStatus: "accepted",
          },
        ],
        status: "confirmed",
        htmlLink: "https://calendar.google.com/event?eid=example8",
      },
      {
        id: "9",
        summary: "Wellness Consultation - David Kim",
        description: "Health and wellness consultation",
        start: {
          dateTime: "2024-01-29T10:30:00",
          timeZone: "America/New_York",
        },
        end: {
          dateTime: "2024-01-29T11:30:00",
          timeZone: "America/New_York",
        },
        location: "Wellness Center",
        attendees: [
          {
            email: "david.k@email.com",
            displayName: "David Kim",
            responseStatus: "accepted",
          },
        ],
        status: "confirmed",
        htmlLink: "https://calendar.google.com/event?eid=example9",
      },
      {
        id: "10",
        summary: "Planning Session",
        description: "Strategic planning for next quarter",
        start: {
          dateTime: "2024-01-30T14:00:00",
          timeZone: "America/New_York",
        },
        end: {
          dateTime: "2024-01-30T16:00:00",
          timeZone: "America/New_York",
        },
        location: "Conference Room B",
        attendees: [
          {
            email: "planning@company.com",
            displayName: "Planning Team",
            responseStatus: "accepted",
          },
        ],
        status: "confirmed",
        htmlLink: "https://calendar.google.com/event?eid=example10",
      },
    ]

    setEvents(mockEvents)
    onEventSync?.(mockEvents)
  }

  const handleConnect = async () => {
    setIsLoading(true)
    setSyncStatus("syncing")

    // Simulate Google OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsConnected(true)
    setIsLoading(false)
    setSyncStatus("success")
    setLastSync(new Date())
    loadMockEvents()

    setTimeout(() => setSyncStatus("idle"), 3000)
  }

  const handleSync = async () => {
    if (!isConnected) return

    setSyncStatus("syncing")
    setIsLoading(true)

    // Simulate sync process
    await new Promise((resolve) => setTimeout(resolve, 1500))

    loadMockEvents()
    setLastSync(new Date())
    setSyncStatus("success")
    setIsLoading(false)

    setTimeout(() => setSyncStatus("idle"), 3000)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setEvents([])
    setLastSync(null)
    setSyncStatus("idle")
  }

  const formatEventTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatEventDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString([], { month: "short", day: "numeric" })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "tentative":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getResponseStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-500"
      case "declined":
        return "bg-red-500"
      case "tentative":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <motion.div
              animate={{ rotate: isLoading ? 360 : 0 }}
              transition={{ duration: 1, repeat: isLoading ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
            >
              <Calendar className="h-5 w-5 mr-2" />
            </motion.div>
            Google Calendar
            {isConnected && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Badge variant="secondary" className="ml-2">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              </motion.div>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {isConnected && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="sm" onClick={handleSync} disabled={isLoading}>
                  <motion.div
                    animate={{ rotate: isLoading ? 360 : 0 }}
                    transition={{ duration: 1, repeat: isLoading ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                  </motion.div>
                  Sync
                </Button>
              </motion.div>
            )}
            <AnimatePresence>
              {syncStatus !== "idle" && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Badge
                    variant={
                      syncStatus === "success" ? "default" : syncStatus === "error" ? "destructive" : "secondary"
                    }
                    className={syncStatus === "syncing" ? "animate-pulse" : ""}
                  >
                    {syncStatus === "syncing" && "Syncing..."}
                    {syncStatus === "success" && "Synced"}
                    {syncStatus === "error" && "Error"}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        {lastSync && (
          <motion.p
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Last synced: {lastSync.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </motion.p>
        )}
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          {!isConnected ? (
            <motion.div
              key="disconnected"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-8"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              </motion.div>
              <h3 className="font-semibold mb-2">Connect Google Calendar</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {userType === "user"
                  ? "Sync your appointments to your personal Google Calendar automatically"
                  : "Connect your business calendar to manage all appointments in one place"}
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={handleConnect} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                      </motion.div>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4 mr-2" />
                      Connect Google Calendar
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="connected"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </motion.div>
                  <span className="text-sm font-medium">Calendar Connected</span>
                  <Badge variant="outline" className="text-xs">
                    {events.length} events
                  </Badge>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="sm" onClick={handleDisconnect}>
                    Disconnect
                  </Button>
                </motion.div>
              </motion.div>

              <ScrollArea className="h-64">
                <AnimatePresence>
                  {events.length > 0 ? (
                    <div className="space-y-3">
                      {events.map((event, index) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ delay: index * 0.1, type: "spring", stiffness: 300, damping: 30 }}
                          whileHover={{
                            scale: 1.02,
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          }}
                          className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <motion.div
                                  animate={{ scale: [1, 1.1, 1] }}
                                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.2 }}
                                >
                                  {getStatusIcon(event.status)}
                                </motion.div>
                                <h4 className="font-medium text-sm">{event.summary}</h4>
                              </div>
                              <div className="text-xs text-muted-foreground space-y-1">
                                <div className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatEventDate(event.start.dateTime)} at {formatEventTime(event.start.dateTime)} -{" "}
                                  {formatEventTime(event.end.dateTime)}
                                </div>
                                {event.location && (
                                  <div className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {event.location}
                                  </div>
                                )}
                              </div>
                            </div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button variant="ghost" size="sm" asChild>
                                <a href={event.htmlLink} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </Button>
                            </motion.div>
                          </div>

                          {event.attendees && event.attendees.length > 0 && (
                            <motion.div
                              className="flex items-center space-x-2 mt-2"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              <span className="text-xs text-muted-foreground">Attendees:</span>
                              <div className="flex space-x-1">
                                {event.attendees.map((attendee, i) => (
                                  <motion.div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${getResponseStatusColor(attendee.responseStatus)}`}
                                    title={`${attendee.displayName || attendee.email} - ${attendee.responseStatus}`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.4 + i * 0.1, type: "spring", stiffness: 500 }}
                                    whileHover={{ scale: 1.5 }}
                                  />
                                ))}
                              </div>
                            </motion.div>
                          )}

                          {event.description && (
                            <motion.p
                              className="text-xs text-muted-foreground mt-2 bg-muted/30 p-2 rounded"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              transition={{ delay: 0.5 }}
                            >
                              {event.description}
                            </motion.p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      className="text-center py-8 text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No events found</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </ScrollArea>

              <motion.div
                className="pt-2 border-t"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-xs text-muted-foreground text-center">
                  {userType === "user"
                    ? "Your appointments are automatically synced to your Google Calendar"
                    : "All customer bookings are synced to your business Google Calendar"}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
