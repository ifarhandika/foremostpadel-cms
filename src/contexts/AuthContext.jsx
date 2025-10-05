import React, { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import authService from "../services/auth"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authService.checkAuth()
        if (res.success) {
          setIsAuthenticated(true)
          setUser(res.user)
        } else {
          setIsAuthenticated(false)
        }
      } catch {
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (user_name, password) => {
    const res = await authService.login(user_name, password)
    if (res.success) {
      setIsAuthenticated(true)
      setUser({ user_name })
      navigate("/")
    } else {
      throw new Error(res.message || "Login failed")
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.error("Logout failed:", err)
    } finally {
      setIsAuthenticated(false)
      setUser(null)
      navigate("/login")
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
