import { Outlet } from "react-router-dom"
import UserHeader from "../../components/headers/User.jsx"
import Footer from "../../components/ui/Footer"
const userLayout = () => {
  return (
    <div className="flex flex-col min-h-screen relative">
      <UserHeader />
      <div className="flex-1 bg-slate-100 pt-20">
        <div className="max-w-container mx-auto">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
    
  )
}

export default userLayout