"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Bot } from "lucide-react"
import Link from "next/link"

export default function ClientRegister() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <Calendar className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl">Client Registration</CardTitle>
            <CardDescription>Create your business account to manage appointments and gain AI insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-8 border-2 border-dashed border-muted rounded-lg">
              <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">Registration Coming Soon</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Clerk authentication will be integrated here. For now, you can access the dashboard directly.
              </p>
              <Link href="/client/dashboard">
                <Button className="w-full">Continue to Dashboard</Button>
              </Link>
            </div>
            <div className="text-center">
              <Link href="/" className="text-sm text-muted-foreground hover:underline">
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
