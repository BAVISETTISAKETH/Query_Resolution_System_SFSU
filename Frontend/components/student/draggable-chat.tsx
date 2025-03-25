"use client"

import { useRef, useEffect } from "react"
import { motion, useMotionValue } from "framer-motion"
import { Flag, Send, User, Bot, X, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  flagged?: boolean
}

interface DraggableChatProps {
  messages: Message[]
  onClose: () => void
  onSend: () => void
  input: string
  setInput: (value: string) => void
  isTyping: boolean
  currentResponse: string
  onFlag: (id: string) => void
}

export function DraggableChat({
  messages,
  onClose,
  onSend,
  input,
  setInput,
  isTyping,
  currentResponse,
  onFlag,
}: DraggableChatProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, currentResponse])

  return (
    <motion.div
      drag
      dragMomentum={false}
      style={{ x, y }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-4 right-4 z-50 w-80 h-96 shadow-lg"
    >
      <Card className="border-purple-500/20 h-full backdrop-blur-lg bg-background/90">
        <CardHeader className="pb-2 border-b cursor-move">
          <CardTitle className="flex items-center justify-between text-sm">
            <span>Floating Chat</span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-6 w-6 rounded-full hover:bg-purple-500/10"
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-6 w-6 rounded-full hover:bg-red-500/10"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 h-[calc(100%-7rem)]">
          <ScrollArea className="h-full p-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex mb-3 group", message.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn("flex gap-2 max-w-[90%]", message.role === "user" ? "flex-row-reverse" : "flex-row")}
                >
                  <Avatar
                    className={cn(
                      "h-6 w-6",
                      message.role === "assistant" ? "bg-purple-100 text-purple-500" : "bg-yellow-100 text-yellow-500",
                    )}
                  >
                    <AvatarFallback>
                      {message.role === "assistant" ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "rounded-lg p-2 text-xs relative group",
                      message.role === "user" ? "bg-yellow-500 text-primary-foreground" : "bg-muted",
                      message.flagged && "border border-red-500",
                    )}
                  >
                    {message.content}
                    {message.role === "assistant" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -right-7 top-0 opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5"
                        onClick={() => onFlag(message.id)}
                      >
                        <Flag
                          className={cn(
                            "h-3 w-3",
                            message.flagged ? "fill-red-500 text-red-500" : "text-muted-foreground",
                          )}
                        />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex mb-3">
                <div className="flex gap-2 max-w-[90%]">
                  <Avatar className="h-6 w-6 bg-purple-100 text-purple-500">
                    <AvatarFallback>
                      <Bot className="h-3 w-3" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-2 bg-muted text-xs">
                    {currentResponse || (
                      <div className="flex space-x-1">
                        <motion.div
                          animate={{ y: [0, -3, 0] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, delay: 0 }}
                          className="h-1.5 w-1.5 bg-purple-500 rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -3, 0] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, delay: 0.2 }}
                          className="h-1.5 w-1.5 bg-purple-500 rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -3, 0] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, delay: 0.4 }}
                          className="h-1.5 w-1.5 bg-purple-500 rounded-full"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t p-2">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onSend()
            }}
            className="flex w-full gap-1"
          >
            <Input
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 h-8 text-xs focus-visible:ring-purple-500"
            />
            <Button
              type="submit"
              size="icon"
              className="bg-purple-600 hover:bg-purple-700 h-8 w-8"
              disabled={!input.trim() || isTyping}
            >
              <Send className="h-3 w-3" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

