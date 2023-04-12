import React from 'react'
import UserRoutes from './userRoutes'
import AdminRoutes from './adminRoutes'
import { Route, Routes } from 'react-router-dom'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/*" element={<UserRoutes />} />
    </Routes>

  )
}

export default AppRoutes