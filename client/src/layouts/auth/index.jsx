import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../../components/ui/Footer'
import Header from '../../components/ui/Header'

const AuthLayout = () => {
  return (
    <div className="authLayout flex flex-col min-h-screen">
        <Header />
        <div className='flex-1'>
          <Outlet />
        </div>
        <Footer />
    </div>
  )
}

export default AuthLayout