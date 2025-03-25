"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Clock, Flag, AlertTriangle, ChevronLeft, ChevronRight, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

type LiveQuery = {
  id: string
  studentName: string
  studentId: string
  question: string
  aiResponse: string
  timestamp: Date
  priority: "high" | "medium" | "low"
  flagged?: boolean
}

export function LiveQueryFeed() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responseText, setResponseText] = useState("")
  const [showResponseDialog, setShowResponseDialog] = useState(false)
  const [queries, setQueries] = useState<LiveQuery[]>([
    {
      id: "1",
      studentName: "Jordan Rivera",
      studentId: "SID2025201",
      question: "How do I apply for a scholarship?",
      aiResponse:
        "To apply for a scholarship, visit the Financial Aid office or go to the university portal and navigate to the 'Scholarships' section. Complete the application form and submit all required documents by the deadline.",
      timestamp: new Date(2025, 2, 19, 10, 15),
      priority: "medium",
    },
    {
      id: "2",
      studentName: "Riley Cooper",
      studentId: "SID2025156",
      question: "What are the library hours during finals week?",
      aiResponse:
        "During finals week, the main library is open 24/7. The specialized libraries (Science, Law, and Medical) have extended hours from 7 AM to 2 AM.",
      timestamp: new Date(2025, 2, 19, 9, 45),
      priority: "low",
    },
    {
      id: "3",
      studentName: "Quinn Martinez",
      studentId: "SID2025089",
      question: "How do I declare a minor?",
      aiResponse:
        "To declare a minor, you need to fill out the Minor Declaration Form available on the Registrar's website. Submit the completed form to your academic advisor for approval.",
      timestamp: new Date(2025, 2, 19, 9, 30),
      priority: "medium",
    },
    {
      id: "4",
      studentName: "Avery Thompson",
      studentId: "SID2025112",
      question: "What is the policy on academic probation?",
      aiResponse:
        "Academic probation is imposed when a student's GPA falls below 2.0. Students on probation must maintain a semester GPA of at least 2.0 to avoid academic suspension.",
      timestamp: new Date(2025, 2, 19, 9, 15),
      priority: "high",
    },
    {
      id: "5",
      studentName: "Cameron Wilson",
      studentId: "SID2025067",
      question: "How do I request an official transcript?",
      aiResponse:
        "Official transcripts can be requested through the university portal. There is a $10 fee per transcript, and processing takes 3-5 business days.",
      timestamp: new Date(2025, 2, 19, 9, 0),
      priority: "low",
    },
  ])

  const nextQuery = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % queries.length)
  }

  const prevQuery = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + queries.length) % queries.length)
  }

  const getPriorityBadge = (priority: LiveQuery["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-500 dark:bg-red-600">High Priority</Badge>
      case "medium":
        return <Badge className="bg-yellow-500 dark:bg-yellow-600">Medium Priority</Badge>
      case "low":
        return <Badge className="bg-green-500 dark:bg-green-600">Low Priority</Badge>
      default:
        return null
    }
  }

  const handleFlagForReview = () => {
    setQueries((prev) => prev.map((query, index) => (index === currentIndex ? { ...query, flagged: true } : query)))
    toast({
      title: "Query flagged for review",
      description: "This query has been added to the review panel.",
    })
  }

  const handleSendResponse = () => {
    if (!responseText.trim()) {
      toast({
        title: "Response cannot be empty",
        description: "Please enter a response before sending.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Response sent",
      description: "Your response has been sent to the student.",
    })
    setResponseText("")
    setShowResponseDialog(false)
  }

  // Simulate new queries coming in
  useEffect(() => {
    const interval = setInterval(() => {
      const names = ["Alex", "Jamie", "Taylor", "Morgan", "Casey", "Jordan", "Riley", "Quinn", "Avery", "Cameron"]
      const newQuery: LiveQuery = {
        id: Date.now().toString(),
        studentName: names[Math.floor(Math.random() * names.length)],
        studentId: `SID2025${Math.floor(Math.random() * 900) + 100}`,
        question: [
          "How do I access my course materials online?",
          "What are the requirements for graduating with honors?",
          "Can I take courses from other departments?",
          "How do I join a student club?",
          "What mental health resources are available on campus?",
        ][Math.floor(Math.random() * 5)],
        aiResponse: "I'll need to look into that for you. Please check back in a moment.",
        timestamp: new Date(),
        priority: ["high", "medium", "low"][Math.floor(Math.random() * 3)] as "high" | "medium" | "low",
      }

      setQueries((prev) => [newQuery, ...prev.slice(0, 9)])
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="border-yellow-500/20 dark:border-yellow-500/10">
      <CardHeader className="pb-3">
        <CardTitle>Live Query Feed</CardTitle>
        <CardDescription>Monitor incoming student queries in real-time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <Button variant="outline" size="icon" onClick={prevQuery} className="z-10">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-1">
              {queries.map((_, index) => (
                <div
                  key={index}
                  className={cn("h-1.5 w-1.5 rounded-full", index === currentIndex ? "bg-yellow-500" : "bg-muted")}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={nextQuery} className="z-10">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="relative h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={queries[currentIndex].id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Card className="h-full border-yellow-500/20 dark:border-yellow-500/10 overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-yellow-500/20">
                          <AvatarFallback className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            {queries[currentIndex].studentName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{queries[currentIndex].studentName}</CardTitle>
                          <CardDescription>{queries[currentIndex].studentId}</CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {getPriorityBadge(queries[currentIndex].priority)}
                        {queries[currentIndex].flagged && (
                          <Badge
                            variant="outline"
                            className="border-red-500 text-red-500 dark:border-red-400 dark:text-red-400"
                          >
                            Flagged
                          </Badge>
                        )}
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {queries[currentIndex].timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
                        <MessageSquare className="h-3.5 w-3.5 text-yellow-500" />
                        Question
                      </h4>
                      <div className="bg-muted p-3 rounded-md text-sm">{queries[currentIndex].question}</div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
                        <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
                        AI Response
                      </h4>
                      <div className="bg-muted p-3 rounded-md text-sm">{queries[currentIndex].aiResponse}</div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      className="gap-1"
                      onClick={handleFlagForReview}
                      disabled={queries[currentIndex].flagged}
                    >
                      <Flag
                        className={cn("h-3.5 w-3.5", queries[currentIndex].flagged ? "fill-red-500 text-red-500" : "")}
                      />
                      <span>{queries[currentIndex].flagged ? "Flagged" : "Flag for Review"}</span>
                    </Button>
                    <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
                      <DialogTrigger asChild>
                        <Button className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700">
                          Respond Directly
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Respond to Student</DialogTitle>
                          <DialogDescription>
                            Your response will be sent directly to {queries[currentIndex].studentName}.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Student Question:</h4>
                            <div className="bg-muted p-3 rounded-md text-sm">{queries[currentIndex].question}</div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Your Response:</h4>
                            <Textarea
                              value={responseText}
                              onChange={(e) => setResponseText(e.target.value)}
                              placeholder="Type your response here..."
                              className="min-h-[150px]"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowResponseDialog(false)}>
                            Cancel
                          </Button>
                          <Button
                            className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 gap-1"
                            onClick={handleSendResponse}
                          >
                            <Send className="h-3.5 w-3.5" />
                            Send Response
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

