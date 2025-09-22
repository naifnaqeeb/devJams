"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const searchParams = useSearchParams();

  const expectedType = searchParams.get("type");

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    const role = user.publicMetadata?.role || user.unsafeMetadata?.role;

    if (expectedType) {
      if (role !== expectedType) {

        signOut(() => router.push(`/login?type=${expectedType}&error=role_mismatch`));
        return;
      }
    }

    if (role === "admin") {
      router.replace("/dashboard/client");
    } else {
      router.replace("/dashboard/user");
    }
    
  }, [isLoaded, user, router, signOut, expectedType]);

  return <p>Verifying and redirecting...</p>;
}