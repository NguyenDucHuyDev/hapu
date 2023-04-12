import React from 'react'
import { Route, Routes } from 'react-router-dom'

import AuthAdminLayout from "../../layouts/auth/admin"
import AdminLayout from '../../layouts/admin'

import AdminRoutesMain from './AdminRoutesMain'

// Admin pages below here
import AdminLoginPage from "../../pages/admin/login"


const AdminRoutes = () => {
  return (

    <Routes>

      <Route element={<AuthAdminLayout />}>
        <Route path='login' element={<AdminLoginPage />} />
      </Route>

      <Route element={<AdminLayout />}>
        <Route path='*' element={<AdminRoutesMain />} />
      </Route>

    </Routes>

  )
}

export default AdminRoutes