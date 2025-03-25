"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Flag, Send, User, Bot, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { DraggableChat } from "@/components/student/draggable-chat"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  flagged?: boolean
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your University AI Assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentResponse, setCurrentResponse] = useState("")
  const [showFloatingChat, setShowFloatingChat] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, currentResponse])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI typing
    setIsTyping(true)
    setCurrentResponse("")

    // Sample responses based on input
    let response = ""
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes("deadline") || lowerInput.includes("submission")) {
      response =
        "The assignment submission deadline is April 15th, 2025. Late submissions will incur a 10% penalty per day."
    } else if (lowerInput.includes("grade") || lowerInput.includes("grading")) {
      response =
        "Grading is done on a scale of A to F. A: 90-100%, B: 80-89%, C: 70-79%, D: 60-69%, F: below 60%. Your final grade will be available two weeks after the final exam."
    } else if (lowerInput.includes("exam") || lowerInput.includes("test")) {
      response =
        "The final exam will be held on May 20th, 2025. It will cover all material from weeks 1-12. You are allowed one sheet of handwritten notes."
    } else {
      response =
        "I don't have specific information about that. Please contact your professor or check the university portal for more details."
    }

    // Simulate typing effect
    let i = 0
    const typingInterval = setInterval(() => {
      setCurrentResponse(response.substring(0, i))
      i++
      if (i > response.length) {
        clearInterval(typingInterval)
        setIsTyping(false)

        // Add AI response to messages
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response,
          role: "assistant",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
        setCurrentResponse("")
      }
    }, 20)
  }

  const handleFlagMessage = (id: string) => {
    setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, flagged: !msg.flagged } : msg)))
  }

  return (
    <>
      <Card className="border-purple-500/20 h-[calc(100vh-12rem)]">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="flex items-center justify-between">
            <span>AI Chat Assistant</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFloatingChat(true)}
              className="rounded-full hover:bg-purple-500/10"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 h-[calc(100%-8rem)]">
          <ScrollArea className="h-full p-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn("flex mb-4 group", message.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn("flex gap-3 max-w-[80%]", message.role === "user" ? "flex-row-reverse" : "flex-row")}
                  >
                    <Avatar
                      className={
                        message.role === "assistant" ? "bg-purple-100 text-purple-500" : "bg-yellow-100 text-yellow-500"
                      }
                    >
                      <AvatarFallback>
                        {message.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "rounded-lg p-3 relative group",
                        message.role === "user" ? "bg-yellow-500 text-primary-foreground" : "bg-muted",
                        message.flagged && "border-2 border-red-500",
                      )}
                    >
                      {message.content}
                      {message.role === "assistant" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute -right-10 top-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleFlagMessage(message.id)}
                        >
                          <Flag
                            className={cn(
                              "h-4 w-4",
                              message.flagged ? "fill-red-500 text-red-500" : "text-muted-foreground",
                            )}
                          />
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex mb-4">
                  <div className="flex gap-3 max-w-[80%]">
                    <Avatar className="bg-purple-100 text-purple-500">
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg p-3 bg-muted">
                      {currentResponse || (
                        <div className="flex space-x-1">
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, delay: 0 }}
                            className="h-2 w-2 bg-purple-500 rounded-full"
                          />
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, delay: 0.2 }}
                            className="h-2 w-2 bg-purple-500 rounded-full"
                          />
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, delay: 0.4 }}
                            className="h-2 w-2 bg-purple-500 rounded-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex w-full gap-2"
          >
            <Input
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 focus-visible:ring-purple-500"
            />
            <Button
              type="submit"
              size="icon"
              className="bg-purple-600 hover:bg-purple-700"
              disabled={!input.trim() || isTyping}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>

      {showFloatingChat && (
        <DraggableChat
          messages={messages}
          onClose={() => setShowFloatingChat(false)}
          onSend={handleSendMessage}
          input={input}
          setInput={setInput}
          isTyping={isTyping}
          currentResponse={currentResponse}
          onFlag={handleFlagMessage}
        />
      )}
    </>
  )
}

