// import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CheckCircle, Calendar, BarChart3 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">TaskTeam</h1>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/login">
              <Button variant="ghost">Sign In</Button>
            </a>
            <a href="/signup">
              <Button>Get Started</Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold text-balance mb-6">Manage Your Team Tasks with Ease</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
          Streamline your team's workflow, track progress, and boost productivity with our intuitive task management
          platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/signup">
            <Button size="lg" className="w-full sm:w-auto">
              Start Free Trial
            </Button>
          </a>
          <a href="/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
              Sign In
            </Button>
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CheckCircle className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Task Management</CardTitle>
              <CardDescription>
                Create, assign, and track tasks with ease. Keep your team organized and focused.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Calendar className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Timeline Tracking</CardTitle>
              <CardDescription>Set deadlines, track progress, and never miss important milestones.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Get insights into team performance and project progress with detailed analytics.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  )
}
