"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Flag, MessageSquare } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/shared/dashboard-header"
import { QueryReviewPanel } from "@/components/faculty/query-review-panel"
import { LiveQueryFeed } from "@/components/faculty/live-query-feed"

export function FacultyDashboard() {
  const [activeTab, setActiveTab] = useState("review")

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-background/80">
      <DashboardHeader userType="faculty" />

      <main className="flex-1 container py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Sidebar */}
          <Card className="lg:col-span-3 border-yellow-500/20">
            <CardHeader className="pb-3">
              <CardTitle>Faculty Dashboard</CardTitle>
              <CardDescription>Review and correct AI responses</CardDescription>
            </CardHeader>
            <CardContent className="pb-1">
              <Tabs defaultValue="review" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger
                    value="review"
                    className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Review
                  </TabsTrigger>
                  <TabsTrigger
                    value="live"
                    className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Live Feed
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
            <CardFooter className="pt-3 text-xs text-muted-foreground">
              <p>5 queries pending review</p>
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
                {activeTab === "review" ? <QueryReviewPanel /> : <LiveQueryFeed />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

