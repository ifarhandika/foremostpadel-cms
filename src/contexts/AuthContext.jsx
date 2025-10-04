import React, { createContext, useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import authService from "../services/auth"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const login = async (user_name, password) => {
    const res = await authService.login(user_name, password)
    // backend sets httpOnly cookie; backend returns success true
    if (res.success) {
      setIsAuthenticated(true)
      setUser({ user_name })
      navigate("/")
    } else {
      throw new Error(res.message || "Login failed")
    }
  }

  const logout = async () => {
    await authService.logout()
    setIsAuthenticated(false)
    setUser(null)
    navigate("/login")
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
