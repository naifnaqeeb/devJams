import { type NextRequest, NextResponse } from "next/server"

// Mock Google Calendar OAuth endpoint
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userType = searchParams.get("userType") || "user"

  // In a real implementation, this would handle Google OAuth flow
  // For now, we'll simulate a successful authentication

  const mockAuthResponse = {
    access_token: "mock_access_token_" + Date.now(),
    refresh_token: "mock_refresh_token_" + Date.now(),
    expires_in: 3600,
    scope: "https://www.googleapis.com/auth/calendar",
    token_type: "Bearer",
    userType,
  }

  return NextResponse.json({
    success: true,
    message: "Google Calendar authentication successful",
    data: mockAuthResponse,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userType } = body

    if (action === "connect") {
      // Simulate OAuth connection process
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return NextResponse.json({
        success: true,
        message: "Google Calendar connected successfully",
        data: {
          connected: true,
          userType,
          permissions: ["read", "write"],
        },
      })
    }

    if (action === "disconnect") {
      return NextResponse.json({
        success: true,
        message: "Google Calendar disconnected successfully",
        data: {
          connected: false,
        },
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
