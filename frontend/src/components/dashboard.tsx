import axios from "axios";
import { useState } from "react";
import { Users, CheckCircle, Calendar, BarChart3, Menu, X, CheckSquare, TrendingUp } from "lucide-react"
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import MyTasks from "./myTask";
import TeamsCard from "./get-team";


export default function Dashboard({ isAuthenticated }: { isAuthenticated: boolean }) {
  console.log("Dashboard rendered with isAuthenticated:", isAuthenticated);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const HandleLogout = async () => {
    console.log("Logout function triggered");
    try {
      const apiUrl = import.meta.env.VITE_API_KEY;
      await axios.get(`${apiUrl}/logout`, { withCredentials: true });
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  }

  if (!isAuthenticated) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <CheckSquare className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">TaskFlow</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <Link to="/tasks" className="text-gray-700 hover:text-blue-600 transition-colors">
                Tasks
              </Link>
              <Link to="/teams" className="text-gray-700 hover:text-blue-600 transition-colors">
                Teams
              </Link>
              {/* <Link to="" className="text-gray-700 hover:text-blue-600 transition-colors">
                Reports
              </Link> */}
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <Link to="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
                <Link to="/tasks" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Tasks
                </Link>
                <Link to="/teams" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Teams
                </Link>

                {
                  isAuthenticated ? <button
                    onClick={HandleLogout}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors w-fit">
                    Logout
                  </button> : <Link to='/signup' className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors w-fit">
                    Get Started
                  </Link>
                }
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Heading */}
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">

            <span className="block text-blue-600">Dashboard</span>
          </h1>


          <MyTasks />
          {/* <TeamsCard /> */}
        </div>
      </section>
    </div>
  )
}