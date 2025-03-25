"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { History, MessageSquare } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChatInterface } from "@/components/student/chat-interface"
import { QueryHistory } from "@/components/student/query-history"
import { DashboardHeader } from "@/components/shared/dashboard-header"

export function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("chat")

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-background/80">
      <DashboardHeader userType="student" />

      <main className="flex-1 container py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Sidebar */}
          <Card className="lg:col-span-3 border-purple-500/20">
            <CardHeader className="pb-3">
              <CardTitle>Student Dashboard</CardTitle>
              <CardDescription>Ask questions and view your query history</CardDescription>
            </CardHeader>
            <CardContent className="pb-1">
              <Tabs defaultValue="chat" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger
                    value="chat"
                    className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                  >
                    <History className="h-4 w-4 mr-2" />
                    History
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
            <CardFooter className="pt-3 text-xs text-muted-foreground">
              <p>Connected to University AI Assistant</p>
            </CardFooter>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {activeTab === "chat" ? <ChatInterface /> : <QueryHistory />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

