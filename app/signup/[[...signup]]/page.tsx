"use client"

import { SignUp } from "@clerk/nextjs"
import { useSearchParams } from "next/navigation"

export default function SignUpPage() {

  const searchParams = useSearchParams()
  const role = searchParams.get('role') || 'user'

  return (
    <div className="flex flex-col h-screen">
      <div className="m-auto">
        <SignUp
          unsafeMetadata={{
            role: role,
          }}
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  )
}