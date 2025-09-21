"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    // Debug: log user metadata to verify role is present and correct
    console.debug("Dashboard redirect - user:", user);
    console.debug("Dashboard redirect - publicMetadata:", user?.publicMetadata);

    // Wait up to 5s for publicMetadata.role to appear (handles delayed metadata propagation)
    let mounted = true;
    const timeoutMs = 5000;
    const pollInterval = 200;
    const start = Date.now();

    const checkRoleAndRedirect = () => {
      if (!mounted) return;
      const role = user?.publicMetadata?.role;
      if (role) {
        if (role === "admin") {
          router.replace("/dashboard/client");
        } else {
          router.replace("/dashboard/user");
        }
        return;
      }

      if (Date.now() - start >= timeoutMs) {
        // Fallback: assume regular user if role not present in time
        router.replace("/dashboard/user");
        return;
      }

      setTimeout(checkRoleAndRedirect, pollInterval);
    };

    checkRoleAndRedirect();

    return () => {
      mounted = false;
    };
  }, [isLoaded, user, router]);

  return <p>Redirecting...</p>;
}
