import React from 'react'
import { AuthProvider } from './contexts/AuthContext'
import AppRoutes from './AppRoutes'

export default function App(){
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
