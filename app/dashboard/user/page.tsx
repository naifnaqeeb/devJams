"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SignOutButton } from "@clerk/nextjs"
import { UserButton, UserProfile } from "@clerk/nextjs"
import {
  Calendar,
  MessageSquare,
  Phone,
  Send,
  Bot,
  User,
  Minimize2,
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  Volume2,
  VolumeX,
  Maximize2,
} from "lucide-react"
import Link from "next/link"
import { GoogleCalendarIntegration } from "@/components/google-calendar-integration"
import { ButtonHover, PulseIndicator } from "@/components/enhanced-animations"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  type?: "booking" | "confirmation" | "general" | "voice"
}

interface Appointment {
  id: string
  title: string
  date: string
  time: string
  location: string
  status: "confirmed" | "pending" | "cancelled"
  service: string
}

export default function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI scheduling assistant. I can help you book appointments, check your calendar, or answer questions about available services. You can chat with me or use voice commands. How can I assist you today?",
      sender: "ai",
      timestamp: new Date(),
      type: "general",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isInCall, setIsInCall] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const callTimerRef = useRef<NodeJS.Timeout | null>(null)

  const [appointments] = useState<Appointment[]>([
    {
      id: "1",
      title: "Hair Cut & Style",
      date: "2024-01-15",
      time: "10:00 AM",
      location: "Downtown Salon",
      status: "confirmed",
      service: "Hair Styling",
    },
    {
      id: "2",
      title: "Dental Checkup",
      date: "2024-01-18",
      time: "2:30 PM",
      location: "City Dental Care",
      status: "confirmed",
      service: "Healthcare",
    },
    {
      id: "3",
      title: "Massage Therapy",
      date: "2024-01-22",
      time: "4:00 PM",
      location: "Wellness Center",
      status: "pending",
      service: "Wellness",
    },
  ])

  const services = ["Hair Styling", "Healthcare", "Wellness", "Fitness", "Beauty", "Consulting"]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (isInCall) {
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current)
      }
      setCallDuration(0)
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current)
      }
    }
  }, [isInCall])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
      type: "general",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputMessage),
        sender: "ai",
        timestamp: new Date(),
        type: inputMessage.toLowerCase().includes("book") ? "booking" : "general",
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("book") || input.includes("appointment") || input.includes("schedule")) {
      return "I'd be happy to help you book an appointment! What type of service are you looking for? I can help you with hair styling, healthcare, wellness, fitness, beauty, or consulting services. Just let me know your preferred date and time."
    }

    if (input.includes("cancel")) {
      return "I can help you cancel an appointment. Which appointment would you like to cancel? Please provide the date or service name, and I'll take care of it for you."
    }

    if (input.includes("reschedule")) {
      return "I can help you reschedule your appointment. Which appointment would you like to move, and what's your preferred new date and time?"
    }

    if (input.includes("available") || input.includes("availability")) {
      return "Let me check availability for you. What service are you interested in and what dates work best for you? I can show you available time slots."
    }

    return "I understand you're looking for assistance. I can help you book appointments, check your calendar, reschedule existing bookings, or provide information about our services. What would you like to do?"
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleVoice = () => {
    if (isInCall) return

    setIsListening(!isListening)
    setIsRecording(!isRecording)

    if (!isListening) {
      setTimeout(() => {
        const voiceMessage: Message = {
          id: Date.now().toString(),
          content: "I'd like to book a hair styling appointment for next Friday afternoon",
          sender: "user",
          timestamp: new Date(),
          type: "voice",
        }
        setMessages((prev) => [...prev, voiceMessage])
        setIsListening(false)
        setIsRecording(false)
        setIsTyping(true)

        setTimeout(() => {
          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            content:
              "I heard you'd like to book a hair styling appointment for next Friday afternoon. Let me check availability for you. I have slots available at 2:00 PM, 3:30 PM, and 4:15 PM. Which time works best for you?",
            sender: "ai",
            timestamp: new Date(),
            type: "booking",
          }
          setMessages((prev) => [...prev, aiResponse])
          setIsTyping(false)
        }, 2000)
      }, 3000)
    }
  }

  const startCall = () => {
    setIsInCall(true)
    setCallDuration(0)

    const callMessage: Message = {
      id: Date.now().toString(),
      content:
        "Voice call started with AI assistant. You can now speak naturally to book appointments or ask questions.",
      sender: "ai",
      timestamp: new Date(),
      type: "voice",
    }
    setMessages((prev) => [...prev, callMessage])

    setTimeout(() => {
      const greetingMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Hello! I'm your AI scheduling assistant. I can hear you clearly. How can I help you with your appointments today?",
        sender: "ai",
        timestamp: new Date(),
        type: "voice",
      }
      setMessages((prev) => [...prev, greetingMessage])
    }, 1500)
  }

  const endCall = () => {
    setIsInCall(false)
    setIsMuted(false)

    const endMessage: Message = {
      id: Date.now().toString(),
      content: `Voice call ended. Call duration: ${formatCallDuration(callDuration)}. You can continue chatting or start another call anytime.`,
      sender: "ai",
      timestamp: new Date(),
      type: "voice",
    }
    setMessages((prev) => [...prev, endMessage])
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const formatCallDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-background">
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
            <Badge variant="secondary">User Dashboard</Badge>
            {isInCall && (
              <PulseIndicator intensity="high">
                <Badge variant="default" className="bg-accent">
                  <PhoneCall className="h-3 w-3 mr-1" />
                  In Call {formatCallDuration(callDuration)}
                </Badge>
              </PulseIndicator>
            )}
            <ButtonHover>
              <Button variant="outline" size="sm" onClick={() => setIsCalendarExpanded(true)}>
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </Button>
            </ButtonHover>
            <ButtonHover>
              <UserButton />
            </ButtonHover>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto p-4 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    AI Assistant
                    {isListening && (
                      <Badge variant="secondary" className="ml-2 animate-pulse">
                        <Mic className="h-3 w-3 mr-1" />
                        Listening...
                      </Badge>
                    )}
                    {isInCall && (
                      <Badge variant="default" className="ml-2 bg-accent">
                        <PhoneCall className="h-3 w-3 mr-1" />
                        On Call
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {!isInCall && (
                      <Button
                        variant={isListening ? "default" : "outline"}
                        size="sm"
                        onClick={toggleVoice}
                        className={isListening ? "bg-accent animate-pulse" : ""}
                        disabled={isInCall}
                      >
                        {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                      </Button>
                    )}

                    {isInCall ? (
                      <div className="flex items-center space-x-2">
                        <Button variant={isMuted ? "destructive" : "outline"} size="sm" onClick={toggleMute}>
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={endCall}>
                          <PhoneOff className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button variant="default" size="sm" onClick={startCall} className="bg-accent">
                        <PhoneCall className="h-4 w-4 mr-2" />
                        Call AI
                      </Button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`flex items-start space-x-2 max-w-[80%] ${
                              message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                            }`}
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`rounded-lg p-3 ${
                                message.sender === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : message.type === "voice"
                                    ? "bg-accent/20 border border-accent"
                                    : "bg-muted"
                              }`}
                            >
                              {message.type === "voice" && (
                                <div className="flex items-center mb-1">
                                  <Phone className="h-3 w-3 mr-1" />
                                  <span className="text-xs font-medium">Voice Message</span>
                                </div>
                              )}
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="flex items-start space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-muted rounded-lg p-3">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                              <div
                                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              />
                              <div
                                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {isRecording && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex justify-center"
                      >
                        <div className="bg-accent/20 border border-accent rounded-lg p-4 text-center">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                            className="flex justify-center mb-2"
                          >
                            <Mic className="h-6 w-6 text-accent" />
                          </motion.div>
                          <p className="text-sm font-medium">Listening to your voice...</p>
                          <p className="text-xs text-muted-foreground">Speak naturally about your appointment needs</p>
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Input
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={
                        isInCall
                          ? "Voice call in progress - use voice to communicate"
                          : "Type your message or ask to book an appointment..."
                      }
                      className="flex-1"
                      disabled={isInCall}
                    />
                    <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isInCall}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  {isInCall && (
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Currently in voice call - speak naturally to interact with the AI assistant
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <GoogleCalendarIntegration
              userType="user"
              onEventSync={(events) => {
                console.log("[v0] Full calendar events synced:", events)
              }}
            />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isCalendarExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsCalendarExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">My Calendar</h2>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open("https://calendar.google.com", "_blank")}
                    >
                      <Maximize2 className="h-4 w-4 mr-2" />
                      Open in Google
                    </Button>
                    <Button variant="ghost" onClick={() => setIsCalendarExpanded(false)}>
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-6 h-[70vh]">
                <GoogleCalendarIntegration
                  userType="user"
                  onEventSync={(events) => {
                    console.log("[v0] Full calendar events synced:", events)
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}