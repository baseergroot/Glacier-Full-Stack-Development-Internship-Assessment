
import { useEffect, useState } from "react"
import HomePage from "./components/home"
import { SignupForm } from "./components/signup-form"
import { LoginForm } from "./components/login-form"
import { Route, Routes } from "react-router-dom"
import Dashboard from "./components/dashboard"
import axios from "axios"

interface User {
  id: string
  name: string
  username: string
}

function App() {
  const apiUrl = import.meta.env.VITE_API_KEY;
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${apiUrl}/user/isauthenticated`, {
          withCredentials: true,
        })
        const data = response.data
        // console.log("Auth check response:", data)
        if (data.success && data.user) {
          setIsAuthenticated(true)
          setUser(data.user)
        } else {
          setIsAuthenticated(false)
          setUser(null)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Dashboard user={user} /> : <HomePage />} />
        <Route path="/signup" element={isAuthenticated ? <Dashboard user={user} /> : <SignupForm />} />
        <Route path="/login" element={isAuthenticated ? <Dashboard user={user} /> : <LoginForm />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard user={user} /> : <HomePage />} />
      </Routes>
    </>
  )
}

export default App
