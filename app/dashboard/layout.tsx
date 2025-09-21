import type React from "react";
import { Protect } from "@clerk/nextjs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Protect>{children}</Protect>;
}
