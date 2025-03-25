"use client"

import { useState } from "react"
import { motion, AnimatePresence, Reorder } from "framer-motion"
import {
  Search,
  Flag,
  CheckCircle,
  Filter,
  Calendar,
  AlertTriangle,
  User,
  Clock,
  ChevronDown,
  ChevronUp,
  Edit,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

type FlaggedQuery = {
  id: string
  studentName: string
  studentId: string
  question: string
  aiResponse: string
  date: Date
  priority: "high" | "medium" | "low"
  status: "pending" | "approved" | "corrected"
  correctedResponse?: string
}

export function QueryReviewPanel() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [correctionText, setCorrectionText] = useState("")
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [queries, setQueries] = useState<FlaggedQuery[]>([
    {
      id: "1",
      studentName: "Alex Johnson",
      studentId: "SID2025001",
      question: "What is the deadline for dropping a course without a 'W' grade?",
      aiResponse:
        "The deadline for dropping a course without receiving a 'W' grade is two weeks after the start of the semester.",
      date: new Date(2025, 2, 18),
      priority: "high",
      status: "pending",
    },
    {
      id: "2",
      studentName: "Jamie Smith",
      studentId: "SID2025042",
      question: "How many credits do I need to graduate with honors?",
      aiResponse: "To graduate with honors, you need to complete 120 credits with a GPA of 3.5 or higher.",
      date: new Date(2025, 2, 17),
      priority: "medium",
      status: "pending",
    },
    {
      id: "3",
      studentName: "Taylor Williams",
      studentId: "SID2025078",
      question: "What are the requirements for applying to the Computer Science graduate program?",
      aiResponse:
        "To apply for the Computer Science graduate program, you need a bachelor's degree in Computer Science or a related field, a minimum GPA of 3.0, GRE scores, and three letters of recommendation.",
      date: new Date(2025, 2, 15),
      priority: "low",
      status: "pending",
    },
    {
      id: "4",
      studentName: "Morgan Lee",
      studentId: "SID2025103",
      question: "Is there a limit to how many courses I can take per semester?",
      aiResponse:
        "The maximum course load is 18 credits per semester. To take more than 18 credits, you need approval from your academic advisor.",
      date: new Date(2025, 2, 14),
      priority: "medium",
      status: "pending",
    },
    {
      id: "5",
      studentName: "Casey Brown",
      studentId: "SID2025129",
      question: "How do I apply for a teaching assistant position?",
      aiResponse:
        "To apply for a teaching assistant position, you need to contact the department offering the course and submit your resume, transcript, and a letter of recommendation from a faculty member.",
      date: new Date(2025, 2, 12),
      priority: "low",
      status: "pending",
    },
  ])

  const filteredQueries = queries.filter((query) => {
    // First apply search filter
    const matchesSearch =
      query.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.aiResponse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.studentName.toLowerCase().includes(searchTerm.toLowerCase())

    // Then apply dropdown filter
    if (activeFilter === "all") return matchesSearch
    if (activeFilter === "high" && query.priority === "high") return matchesSearch
    if (activeFilter === "medium" && query.priority === "medium") return matchesSearch
    if (activeFilter === "low" && query.priority === "low") return matchesSearch
    if (activeFilter === "pending" && query.status === "pending") return matchesSearch
    if (activeFilter === "approved" && query.status === "approved") return matchesSearch
    if (activeFilter === "corrected" && query.status === "corrected") return matchesSearch

    return false
  })

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null)
      setEditingId(null)
    } else {
      setExpandedId(id)
      setEditingId(null)
    }
  }

  const startEditing = (id: string, currentResponse: string) => {
    setEditingId(id)
    setCorrectionText(currentResponse)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setCorrectionText("")
  }

  const saveCorrection = (id: string) => {
    setQueries((prev) =>
      prev.map((query) =>
        query.id === id
          ? { ...query, aiResponse: correctionText, status: "corrected", correctedResponse: correctionText }
          : query,
      ),
    )
    setEditingId(null)
    setCorrectionText("")
    toast({
      title: "Response corrected",
      description: "The student will be notified of your correction.",
    })
  }

  const approveResponse = (id: string) => {
    setQueries((prev) => prev.map((query) => (query.id === id ? { ...query, status: "approved" } : query)))
    toast({
      title: "Response approved",
      description: "The AI response has been marked as accurate.",
    })
  }

  const getPriorityBadge = (priority: FlaggedQuery["priority"]) => {
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

  const getStatusBadge = (status: FlaggedQuery["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="border-orange-500 text-orange-500 dark:border-orange-400 dark:text-orange-400"
          >
            Pending Review
          </Badge>
        )
      case "approved":
        return (
          <Badge
            variant="outline"
            className="border-green-500 text-green-500 dark:border-green-400 dark:text-green-400"
          >
            Approved
          </Badge>
        )
      case "corrected":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400">
            Corrected
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card className="border-yellow-500/20 dark:border-yellow-500/10">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Query Review Panel</CardTitle>
            <CardDescription>Review and correct flagged AI responses</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 gap-1">
                <Filter className="h-3.5 w-3.5" />
                <span>Filter: {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setActiveFilter("all")}>
                All Queries
                {activeFilter === "all" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("high")}>
                High Priority
                {activeFilter === "high" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("medium")}>
                Medium Priority
                {activeFilter === "medium" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("low")}>
                Low Priority
                {activeFilter === "low" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("pending")}>
                Pending Review
                {activeFilter === "pending" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("approved")}>
                Approved
                {activeFilter === "approved" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("corrected")}>
                Corrected
                {activeFilter === "corrected" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search queries..."
            className="pl-8 focus-visible:ring-yellow-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-20rem)]">
          <Reorder.Group values={filteredQueries} onReorder={setQueries} className="px-4 pb-4 space-y-3">
            <AnimatePresence initial={false}>
              {filteredQueries.length > 0 ? (
                filteredQueries.map((query) => (
                  <Reorder.Item
                    key={query.id}
                    value={query}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <Card
                      className={cn(
                        "overflow-hidden transition-all duration-200 hover:shadow-md",
                        expandedId === query.id ? "border-yellow-500/50 dark:border-yellow-500/30" : "border-border",
                        query.status === "approved"
                          ? "bg-green-500/5 dark:bg-green-500/10"
                          : query.status === "corrected"
                            ? "bg-blue-500/5 dark:bg-blue-500/10"
                            : "",
                      )}
                    >
                      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                        <div className="space-y-1 cursor-pointer flex-1" onClick={() => toggleExpand(query.id)}>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">{query.question}</CardTitle>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{query.studentName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{query.date.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{query.date.toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2">
                            {getPriorityBadge(query.priority)}
                            {getStatusBadge(query.status)}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => toggleExpand(query.id)}
                          >
                            {expandedId === query.id ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
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
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
                                    <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
                                    Flagged AI Response
                                  </h4>
                                  {editingId === query.id ? (
                                    <div className="space-y-2">
                                      <Textarea
                                        value={correctionText}
                                        onChange={(e) => setCorrectionText(e.target.value)}
                                        className="min-h-[100px] focus-visible:ring-yellow-500"
                                      />
                                      <div className="flex justify-end gap-2">
                                        <Button variant="outline" size="sm" onClick={cancelEditing}>
                                          Cancel
                                        </Button>
                                        <Button
                                          size="sm"
                                          className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700"
                                          onClick={() => saveCorrection(query.id)}
                                        >
                                          Save Correction
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="bg-muted p-3 rounded-md text-sm">{query.aiResponse}</div>
                                  )}
                                </div>

                                {query.status === "corrected" && query.correctedResponse && (
                                  <div>
                                    <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
                                      <CheckCircle className="h-3.5 w-3.5 text-blue-500" />
                                      Corrected Response
                                    </h4>
                                    <div className="bg-blue-500/10 p-3 rounded-md text-sm">
                                      {query.correctedResponse}
                                    </div>
                                  </div>
                                )}

                                {query.status === "pending" && (
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      className="gap-1"
                                      onClick={() => startEditing(query.id, query.aiResponse)}
                                    >
                                      <Edit className="h-3.5 w-3.5" />
                                      <span>Correct</span>
                                    </Button>
                                    <Button
                                      className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 gap-1"
                                      onClick={() => approveResponse(query.id)}
                                    >
                                      <CheckCircle className="h-3.5 w-3.5" />
                                      <span>Approve</span>
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </Reorder.Item>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-40 p-4">
                  <Flag className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground text-center">
                    No flagged queries found. Try adjusting your search or filter.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </Reorder.Group>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

