"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const error = searchParams.get("error");

  const redirectUrl = `/dashboard?type=${type || "user"}`;

  const errorMessages = {
    role_mismatch: "Login failed. Please use the correct portal for your account type.",
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="m-auto">
        <SignIn redirectUrl={redirectUrl} />
        {error && (
          <div className="mt-4 flex items-center justify-center p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium text-center max-w-sm">
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            {errorMessages[error as keyof typeof errorMessages] || "An unknown error occurred."}
          </div>
        )}
      </div>
    </div>
  );
}