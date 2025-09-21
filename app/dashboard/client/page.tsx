"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserButton, UserProfile, SignOutButton } from "@clerk/nextjs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Users,
  Clock,
  Phone,
  Mail,
  TrendingUp,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bot,
} from "lucide-react"
import Link from "next/link"
import { GoogleCalendarIntegration } from "@/components/google-calendar-integration"
interface ClientAppointment {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  service: string
  date: string
  time: string
  duration: number
  status: "confirmed" | "pending" | "cancelled" | "completed"
  notes?: string
  price: number
}

interface CalendarDay {
  date: Date
  appointments: ClientAppointment[]
  isToday: boolean
  isCurrentMonth: boolean
}

export default function ClientDashboard() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedView, setSelectedView] = useState<"day" | "week" | "month">("week")
  const [selectedAppointment, setSelectedAppointment] = useState<ClientAppointment | null>(null)
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])

  const [appointments] = useState<ClientAppointment[]>([
    {
      id: "1",
      customerName: "Sarah Johnson",
      customerEmail: "sarah.j@email.com",
      customerPhone: "+1 (555) 123-4567",
      service: "Hair Cut & Style",
      date: "2024-01-15",
      time: "10:00 AM",
      duration: 90,
      status: "confirmed",
      notes: "First time customer, prefers shorter styles",
      price: 85,
    },
    {
      id: "2",
      customerName: "Michael Chen",
      customerEmail: "m.chen@email.com",
      customerPhone: "+1 (555) 234-5678",
      service: "Dental Checkup",
      date: "2024-01-15",
      time: "2:30 PM",
      duration: 60,
      status: "confirmed",
      price: 120,
    },
    {
      id: "3",
      customerName: "Emma Davis",
      customerEmail: "emma.davis@email.com",
      customerPhone: "+1 (555) 345-6789",
      service: "Massage Therapy",
      date: "2024-01-16",
      time: "4:00 PM",
      duration: 75,
      status: "pending",
      notes: "Requested deep tissue massage",
      price: 95,
    },
    {
      id: "4",
      customerName: "James Wilson",
      customerEmail: "j.wilson@email.com",
      customerPhone: "+1 (555) 456-7890",
      service: "Personal Training",
      date: "2024-01-17",
      time: "9:00 AM",
      duration: 60,
      status: "confirmed",
      price: 75,
    },
    {
      id: "5",
      customerName: "Lisa Brown",
      customerEmail: "lisa.b@email.com",
      customerPhone: "+1 (555) 567-8901",
      service: "Consultation",
      date: "2024-01-18",
      time: "11:30 AM",
      duration: 45,
      status: "completed",
      price: 150,
    },
  ])

  const services = [
    { name: "Hair Cut & Style", duration: 90, price: 85, color: "bg-blue-500" },
    { name: "Dental Checkup", duration: 60, price: 120, color: "bg-green-500" },
    { name: "Massage Therapy", duration: 75, price: 95, color: "bg-purple-500" },
    { name: "Personal Training", duration: 60, price: 75, color: "bg-orange-500" },
    { name: "Consultation", duration: 45, price: 150, color: "bg-pink-500" },
    { name: "Meeting", duration: 60, price: 0, color: "bg-gray-500" },
    { name: "Review", duration: 90, price: 200, color: "bg-gray-500" },
    { name: "Planning", duration: 120, price: 150, color: "bg-gray-500" },
  ]

  useEffect(() => {
    generateCalendarDays()
  }, [currentDate, selectedView])

  const generateCalendarDays = () => {
    const days: CalendarDay[] = []
    const today = new Date()
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    const startOfWeek = new Date(startOfMonth)
    startOfWeek.setDate(startOfMonth.getDate() - startOfMonth.getDay())

    for (let i = 0; i < 42; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)

      const dayAppointments = appointments.filter((apt) => {
        const aptDate = new Date(apt.date)
        return (
          aptDate.getDate() === date.getDate() &&
          aptDate.getMonth() === date.getMonth() &&
          aptDate.getFullYear() === date.getFullYear()
        )
      })

      const googleCalendarEvents = generateGoogleCalendarEvents(date)
      const allDayAppointments = [...dayAppointments, ...googleCalendarEvents]

      days.push({
        date,
        appointments: allDayAppointments,
        isToday:
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear(),
        isCurrentMonth: date.getMonth() === currentDate.getMonth(),
      })
    }

    setCalendarDays(days)
  }

  const generateGoogleCalendarEvents = (date: Date): ClientAppointment[] => {
    const events: ClientAppointment[] = []
    const dayOfWeek = date.getDay()
    const dateStr = date.toISOString().split("T")[0]

    if (dayOfWeek === 1) {
      // Mondays
      events.push({
        id: `google-${dateStr}-1`,
        customerName: "Team Meeting",
        customerEmail: "team@company.com",
        customerPhone: "+1 (555) 000-0000",
        service: "Meeting",
        date: dateStr,
        time: "9:00 AM",
        duration: 60,
        status: "confirmed",
        price: 0,
      })
    }

    if (dayOfWeek === 3) {
      // Wednesdays
      events.push({
        id: `google-${dateStr}-2`,
        customerName: "Client Review",
        customerEmail: "client@email.com",
        customerPhone: "+1 (555) 111-1111",
        service: "Review",
        date: dateStr,
        time: "2:00 PM",
        duration: 90,
        status: "confirmed",
        price: 200,
      })
    }

    if (dayOfWeek === 5) {
      // Fridays
      events.push({
        id: `google-${dateStr}-3`,
        customerName: "Planning Session",
        customerEmail: "planning@company.com",
        customerPhone: "+1 (555) 222-2222",
        service: "Planning",
        date: dateStr,
        time: "3:30 PM",
        duration: 120,
        status: "confirmed",
        price: 150,
      })
    }

    return events
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1))
    setCurrentDate(newDate)
  }

  const getStatusIcon = (status: ClientAppointment["status"]) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
    }
  }

  const getServiceColor = (serviceName: string) => {
    const service = services.find((s) => s.name === serviceName)
    return service?.color || "bg-gray-500"
  }

  const todayAppointments = appointments.filter((apt) => {
    const today = new Date()
    const aptDate = new Date(apt.date)
    return (
      aptDate.getDate() === today.getDate() &&
      aptDate.getMonth() === today.getMonth() &&
      aptDate.getFullYear() === today.getFullYear()
    )
  })

  const upcomingAppointments = appointments
    .filter((apt) => {
      const today = new Date()
      const aptDate = new Date(apt.date)
      return aptDate > today
    })
    .slice(0, 5)

  const stats = {
    totalBookings: appointments.length,
    todayBookings: todayAppointments.length,
    pendingBookings: appointments.filter((apt) => apt.status === "pending").length,
    revenue: appointments.filter((apt) => apt.status === "completed").reduce((sum, apt) => sum + apt.price, 0),
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur"
      >
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Calendar className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">ScheduleAI</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Badge variant="secondary">
              <Bot className="h-3 w-3 mr-1" />
              Client Dashboard
            </Badge>
            {/* Clerk user button provides quick access to profile and sign-out */}
            <UserButton />
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto p-4 max-w-7xl">
        {/* Stats Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">{stats.totalBookings}</p>
                </div>
                <CalendarDays className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Bookings</p>
                  <p className="text-2xl font-bold">{stats.todayBookings}</p>
                </div>
                <Clock className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{stats.pendingBookings}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">${stats.revenue}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Calendar Area */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Calendar Management
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Select value={selectedView} onValueChange={(value: any) => setSelectedView(value)}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Day</SelectItem>
                        <SelectItem value="week">Week</SelectItem>
                        <SelectItem value="month">Month</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Slot
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h3 className="text-lg font-semibold">
                      {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                {selectedView === "month" && (
                  <div className="grid grid-cols-7 gap-1">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                        {day}
                      </div>
                    ))}
                    {calendarDays.map((day, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.01 }}
                        className={`min-h-[80px] p-1 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                          day.isToday ? "bg-primary/10 border-primary" : ""
                        } ${!day.isCurrentMonth ? "opacity-50" : ""}`}
                      >
                        <div className="text-sm font-medium mb-1">{day.date.getDate()}</div>
                        <div className="space-y-1">
                          {day.appointments.slice(0, 2).map((apt) => (
                            <div
                              key={apt.id}
                              className={`text-xs p-1 rounded text-white truncate ${getServiceColor(apt.service)}`}
                              onClick={() => setSelectedAppointment(apt)}
                            >
                              {apt.time} - {apt.customerName}
                            </div>
                          ))}
                          {day.appointments.length > 2 && (
                            <div className="text-xs text-muted-foreground">+{day.appointments.length - 2} more</div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {selectedView === "week" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-7 gap-4">
                      {calendarDays.slice(0, 7).map((day, index) => (
                        <motion.div
                          key={index}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-3 border rounded-lg ${day.isToday ? "bg-primary/10 border-primary" : ""}`}
                        >
                          <div className="text-center mb-2">
                            <div className="text-sm text-muted-foreground">
                              {day.date.toLocaleDateString("en-US", { weekday: "short" })}
                            </div>
                            <div className="text-lg font-semibold">{day.date.getDate()}</div>
                          </div>
                          <div className="space-y-2">
                            {day.appointments.map((apt) => (
                              <div
                                key={apt.id}
                                className={`text-xs p-2 rounded text-white cursor-pointer ${getServiceColor(
                                  apt.service,
                                )}`}
                                onClick={() => setSelectedAppointment(apt)}
                              >
                                <div className="font-medium">{apt.time}</div>
                                <div className="truncate">{apt.customerName}</div>
                                <div className="truncate opacity-90">{apt.service}</div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedView === "day" && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold">
                        {currentDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {todayAppointments.length > 0 ? (
                        todayAppointments.map((apt) => (
                          <motion.div
                            key={apt.id}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            whileHover={{ scale: 1.02 }}
                            className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer"
                            onClick={() => setSelectedAppointment(apt)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${getServiceColor(apt.service)}`} />
                                <div>
                                  <div className="font-medium">{apt.customerName}</div>
                                  <div className="text-sm text-muted-foreground">{apt.service}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">{apt.time}</div>
                                <div className="flex items-center space-x-1">
                                  {getStatusIcon(apt.status)}
                                  <span className="text-sm capitalize">{apt.status}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No appointments scheduled for today</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Sidebar */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Google Calendar Integration */}
            <GoogleCalendarIntegration
              userType="client"
              onEventSync={(events) => {
                console.log("[v0] Client calendar events synced:", events)
              }}
            />

            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  {todayAppointments.length > 0 ? (
                    <div className="space-y-3">
                      {todayAppointments.map((apt) => (
                        <motion.div
                          key={apt.id}
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => setSelectedAppointment(apt)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{apt.time}</span>
                            {getStatusIcon(apt.status)}
                          </div>
                          <div className="text-sm">
                            <div className="font-medium">{apt.customerName}</div>
                            <div className="text-muted-foreground">{apt.service}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No appointments today</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {upcomingAppointments.map((apt) => (
                      <motion.div
                        key={apt.id}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => setSelectedAppointment(apt)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            {new Date(apt.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                          {getStatusIcon(apt.status)}
                        </div>
                        <div className="text-sm">
                          <div className="font-medium">{apt.customerName}</div>
                          <div className="text-muted-foreground">{apt.service}</div>
                          <div className="text-muted-foreground">{apt.time}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      <AnimatePresence>
        {selectedAppointment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAppointment(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-lg shadow-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Appointment Details</h3>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedAppointment(null)}>
                    ×
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>{selectedAppointment.customerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{selectedAppointment.customerName}</div>
                      <div className="text-sm text-muted-foreground">{selectedAppointment.service}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Date</div>
                      <div className="font-medium">{new Date(selectedAppointment.date).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Time</div>
                      <div className="font-medium">{selectedAppointment.time}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Duration</div>
                      <div className="font-medium">{selectedAppointment.duration} min</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Price</div>
                      <div className="font-medium">${selectedAppointment.price}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedAppointment.customerEmail}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedAppointment.customerPhone}</span>
                    </div>
                  </div>

                  {selectedAppointment.notes && (
                    <div>
                      <div className="text-muted-foreground text-sm mb-1">Notes</div>
                      <div className="text-sm bg-muted p-2 rounded">{selectedAppointment.notes}</div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Status:</span>
                    <Badge
                      variant={
                        selectedAppointment.status === "confirmed"
                          ? "default"
                          : selectedAppointment.status === "pending"
                            ? "secondary"
                            : selectedAppointment.status === "completed"
                              ? "default"
                              : "destructive"
                      }
                    >
                      {selectedAppointment.status}
                    </Badge>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button size="sm" className="flex-1">
                      Confirm
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      Reschedule
                    </Button>
                    <Button variant="destructive" size="sm" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
