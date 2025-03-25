"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Flag, ChevronDown, ChevronUp, MessageSquare, Calendar, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

type QueryItem = {
  id: string
  question: string
  answer: string
  date: Date
  status: "answered" | "flagged" | "resolved"
}

export function QueryHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Sample query history
  const queries: QueryItem[] = [
    {
      id: "1",
      question: "When is the final exam for Computer Science 101?",
      answer: "The final exam for CS101 will be held on May 20th, 2025 at 10:00 AM in the Main Hall.",
      date: new Date(2025, 2, 15),
      status: "answered",
    },
    {
      id: "2",
      question: "What is the grading policy for late assignments?",
      answer:
        "Late assignments incur a 10% penalty per day, up to a maximum of 50%. After 5 days, assignments will not be accepted without a valid excuse.",
      date: new Date(2025, 2, 10),
      status: "flagged",
    },
    {
      id: "3",
      question: "How do I apply for a course extension?",
      answer:
        "To apply for a course extension, you need to fill out the Extension Request Form available on the student portal and submit it to your academic advisor at least two weeks before the end of the semester.",
      date: new Date(2025, 2, 5),
      status: "resolved",
    },
    {
      id: "4",
      question: "What are the prerequisites for Advanced Machine Learning?",
      answer:
        "The prerequisites for Advanced Machine Learning (CS450) are: Introduction to Machine Learning (CS350), Data Structures and Algorithms (CS201), and Statistics for Computer Science (MATH240). You must have received at least a B grade in each of these courses.",
      date: new Date(2025, 1, 28),
      status: "answered",
    },
    {
      id: "5",
      question: "How do I access the online library resources off-campus?",
      answer:
        "To access the university library resources off-campus, you need to use the VPN service provided by the university. Log in with your student credentials at vpn.university.edu and then you can access all digital resources as if you were on campus.",
      date: new Date(2025, 1, 20),
      status: "answered",
    },
  ]

  const filteredQueries = queries.filter(
    (query) =>
      query.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const getStatusBadge = (status: QueryItem["status"]) => {
    switch (status) {
      case "answered":
        return <Badge className="bg-green-500">Answered</Badge>
      case "flagged":
        return <Badge className="bg-red-500">Flagged</Badge>
      case "resolved":
        return <Badge className="bg-blue-500">Resolved</Badge>
      default:
        return null
    }
  }

  return (
    <Card className="border-purple-500/20">
      <CardHeader className="pb-3">
        <CardTitle>Query History</CardTitle>
        <CardDescription>View and search your previous questions</CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search queries..."
            className="pl-8 focus-visible:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-20rem)]">
          <AnimatePresence initial={false}>
            {filteredQueries.length > 0 ? (
              <div className="px-4 pb-4 space-y-3">
                {filteredQueries.map((query) => (
                  <motion.div
                    key={query.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      className={cn(
                        "overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer",
                        expandedId === query.id ? "border-purple-500/50" : "border-border",
                      )}
                      onClick={() => toggleExpand(query.id)}
                    >
                      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                        <div className="space-y-1">
                          <CardTitle className="text-base">{query.question}</CardTitle>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{query.date.toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(query.status)}
                          {expandedId === query.id ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </CardHeader>
                      <AnimatePresence>
                        {expandedId === query.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <CardContent className="p-4 pt-0">
                              <Separator className="my-2" />
                              <div className="flex gap-2 items-start mt-2">
                                <Badge
                                  variant="outline"
                                  className="bg-purple-500/10 text-purple-700 dark:text-purple-300 h-5 rounded-full"
                                >
                                  AI
                                </Badge>
                                <p className="text-sm">{query.answer}</p>
                              </div>
                              {query.status === "flagged" && (
                                <div className="mt-3 p-2 bg-red-500/10 rounded-md text-xs flex items-center gap-2">
                                  <Flag className="h-3 w-3 text-red-500" />
                                  <span>This response has been flagged for review by faculty.</span>
                                </div>
                              )}
                              {query.status === "resolved" && (
                                <div className="mt-3 p-2 bg-blue-500/10 rounded-md text-xs flex items-center gap-2">
                                  <CheckCircle className="h-3 w-3 text-blue-500" />
                                  <span>This query has been reviewed and resolved by faculty.</span>
                                </div>
                              )}
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 p-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground text-center">No queries found. Try adjusting your search.</p>
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

