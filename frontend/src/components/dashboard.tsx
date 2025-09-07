"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Users, CheckCircle, Calendar, BarChart3, LogOut, Settings, UserPlus, CheckSquare } from "lucide-react"
import CreateTeamForm from "./create-team"
import CreateTaskForm from "./create-task"
import AddMemberForm from "./add-member"

interface User {
  id: string
  name: string
  username: string
}

interface DashboardProps {
  user: User | null
}

export default function Dashboard({ user }: DashboardProps) {
  const [tasks] = useState([
    { id: 1, title: "Design new landing page", status: "In Progress", priority: "High", dueDate: "2024-01-15" },
    { id: 2, title: "Fix authentication bug", status: "Todo", priority: "Medium", dueDate: "2024-01-18" },
    { id: 3, title: "Update documentation", status: "Completed", priority: "Low", dueDate: "2024-01-12" },
  ])

  const [teams, setTeams] = useState([])
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false)
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/user/logout", {
        method: "POST",
        credentials: "include",
      })
      // Reload the page to trigger auth check
      window.location.reload()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleTeamCreated = (team: any) => {
    setTeams((prev) => [...prev, team])
    setIsCreateTeamOpen(false)
  }

  const handleTaskCreated = (task: any) => {
    setIsCreateTaskOpen(false)
    // You can add task to local state here if needed
  }

  const handleMemberAdded = (updatedTeam: any) => {
    setTeams((prev) => prev.map((team) => (team._id === updatedTeam._id ? updatedTeam : team)))
    setIsAddMemberOpen(false)
  }

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
            <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Active tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teams.reduce((acc, team) => acc + team.members?.length || 0, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Across {teams.length} teams</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Dialog open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
            <DialogTrigger asChild>
              <Button>
                <Users className="h-4 w-4 mr-2" />
                Create Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
              </DialogHeader>
              <CreateTeamForm onTeamCreated={handleTeamCreated} onCancel={() => setIsCreateTeamOpen(false)} />
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
            <DialogTrigger asChild>
              <Button>
                <CheckSquare className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <CreateTaskForm
                teams={teams}
                onTaskCreated={handleTaskCreated}
                onCancel={() => setIsCreateTaskOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
              </DialogHeader>
              <AddMemberForm
                teams={teams}
                onMemberAdded={handleMemberAdded}
                onCancel={() => setIsAddMemberOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Tasks Section */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Manage and track your team's tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">Due: {task.dueDate}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        task.priority === "High" ? "destructive" : task.priority === "Medium" ? "default" : "secondary"
                      }
                    >
                      {task.priority}
                    </Badge>
                    <Badge variant={task.status === "Completed" ? "default" : "outline"}>{task.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
