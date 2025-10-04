import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Courts from "./pages/Courts"
import Events from "./pages/Events"
import Investors from "./pages/Investors"
import PrivateRoute from "./components/PrivateRoute"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/court"
        element={
          <PrivateRoute>
            <Courts />
          </PrivateRoute>
        }
      />

      <Route
        path="/event"
        element={
          <PrivateRoute>
            <Events />
          </PrivateRoute>
        }
      />

      <Route
        path="/investor"
        element={
          <PrivateRoute>
            <Investors />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
