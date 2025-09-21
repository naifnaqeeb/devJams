import { type NextRequest, NextResponse } from "next/server"

// Mock Google Calendar events endpoint
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userType = searchParams.get("userType") || "user"
  const timeMin = searchParams.get("timeMin")
  const timeMax = searchParams.get("timeMax")

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock events data based on user type
  const mockEvents =
    userType === "user"
      ? [
          {
            id: "user_event_1",
            summary: "Hair Appointment",
            description: "Scheduled via ScheduleAI",
            start: {
              dateTime: "2024-01-15T10:00:00-05:00",
              timeZone: "America/New_York",
            },
            end: {
              dateTime: "2024-01-15T11:30:00-05:00",
              timeZone: "America/New_York",
            },
            location: "Downtown Salon",
            status: "confirmed",
            htmlLink: "https://calendar.google.com/event?eid=user_event_1",
          },
          {
            id: "user_event_2",
            summary: "Dental Checkup",
            description: "Scheduled via ScheduleAI",
            start: {
              dateTime: "2024-01-18T14:30:00-05:00",
              timeZone: "America/New_York",
            },
            end: {
              dateTime: "2024-01-18T15:30:00-05:00",
              timeZone: "America/New_York",
            },
            location: "City Dental Care",
            status: "confirmed",
            htmlLink: "https://calendar.google.com/event?eid=user_event_2",
          },
        ]
      : [
          {
            id: "client_event_1",
            summary: "Sarah Johnson - Hair Cut & Style",
            description: "Customer appointment scheduled via ScheduleAI",
            start: {
              dateTime: "2024-01-15T10:00:00-05:00",
              timeZone: "America/New_York",
            },
            end: {
              dateTime: "2024-01-15T11:30:00-05:00",
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
            htmlLink: "https://calendar.google.com/event?eid=client_event_1",
          },
          {
            id: "client_event_2",
            summary: "Michael Chen - Dental Checkup",
            description: "Customer appointment scheduled via ScheduleAI",
            start: {
              dateTime: "2024-01-15T14:30:00-05:00",
              timeZone: "America/New_York",
            },
            end: {
              dateTime: "2024-01-15T15:30:00-05:00",
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
            htmlLink: "https://calendar.google.com/event?eid=client_event_2",
          },
          {
            id: "client_event_3",
            summary: "Emma Davis - Massage Therapy",
            description: "Customer appointment scheduled via ScheduleAI - Deep tissue massage requested",
            start: {
              dateTime: "2024-01-16T16:00:00-05:00",
              timeZone: "America/New_York",
            },
            end: {
              dateTime: "2024-01-16T17:15:00-05:00",
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
            htmlLink: "https://calendar.google.com/event?eid=client_event_3",
          },
        ]

  return NextResponse.json({
    success: true,
    data: {
      items: mockEvents,
      nextSyncToken: "mock_sync_token_" + Date.now(),
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, eventData, userType } = body

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (action === "create") {
      const newEvent = {
        id: "new_event_" + Date.now(),
        ...eventData,
        status: "confirmed",
        htmlLink: `https://calendar.google.com/event?eid=new_event_${Date.now()}`,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
      }

      return NextResponse.json({
        success: true,
        message: "Event created successfully",
        data: newEvent,
      })
    }

    if (action === "update") {
      const updatedEvent = {
        ...eventData,
        updated: new Date().toISOString(),
      }

      return NextResponse.json({
        success: true,
        message: "Event updated successfully",
        data: updatedEvent,
      })
    }

    if (action === "delete") {
      return NextResponse.json({
        success: true,
        message: "Event deleted successfully",
      })
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid action",
      },
      { status: 400 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
}
