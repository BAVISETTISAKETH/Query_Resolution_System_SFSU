import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-background/80">
      <header className="border-b border-border/40 backdrop-blur-sm fixed w-full z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-yellow-500">
              UniQuery
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-4 container">
        <div className="max-w-3xl w-full space-y-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            University Query{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-yellow-500">
              Resolution System
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Get instant answers to your university-related questions with our AI-powered system. Faculty-reviewed for
            accuracy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link href="/student">Student Dashboard</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
            >
              <Link href="/faculty">Faculty Dashboard</Link>
            </Button>
          </div>
        </div>
      </main>
      <footer className="border-t border-border/40 py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} University Query Resolution System. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

