"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Bell, User, LogOut, Settings, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  userType: "student" | "faculty"
}

export function DashboardHeader({ userType }: DashboardHeaderProps) {
  const router = useRouter()
  const [notificationCount, setNotificationCount] = useState(3)
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    {
      id: 1,
      title: "New response to your query",
      description: "A faculty member has responded to your question about course registration.",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "Query flagged for review",
      description: "Your query about graduation requirements has been flagged for faculty review.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 3,
      title: "System maintenance",
      description: "The system will be down for maintenance on Sunday from 2-4 AM.",
      time: "1 day ago",
      read: false,
    },
  ]

  const handleNotificationClick = () => {
    setShowNotifications(true)
    setNotificationCount(0)
  }

  const handleProfileClick = (action: string) => {
    // In a real app, these would navigate to actual pages
    alert(`Navigating to ${action} page`)
    // router.push(`/${userType}/${action.toLowerCase()}`);
  }

  const handleLogout = () => {
    alert("Logging out...")
    router.push("/")
  }

  return (
    <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 w-full z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-yellow-500">
              UniQuery
            </span>
          </Link>
          <Badge
            variant="outline"
            className={
              userType === "student"
                ? "border-purple-500 text-purple-500 ml-2 dark:border-purple-400 dark:text-purple-400"
                : "border-yellow-500 text-yellow-500 ml-2 dark:border-yellow-400 dark:text-yellow-400"
            }
          >
            {userType === "student" ? "Student" : "Faculty"}
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <Sheet open={showNotifications} onOpenChange={setShowNotifications}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" onClick={handleNotificationClick}>
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center"
                  >
                    {notificationCount}
                  </motion.div>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Notifications</SheetTitle>
              </SheetHeader>
              <Separator className="my-4" />
              <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="space-y-4 pr-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn("p-4 rounded-lg border", notification.read ? "bg-background" : "bg-muted")}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium">{notification.title}</h4>
                        {!notification.read && <Badge className="bg-blue-500">New</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.description}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback
                    className={
                      userType === "student"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }
                  >
                    {userType === "student" ? "SU" : "FU"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block">
                  {userType === "student" ? "Student User" : "Faculty User"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleProfileClick("Profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleProfileClick("Settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

