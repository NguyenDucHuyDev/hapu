import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const logoutPage = () => {
  const navigate = useNavigate()
  localStorage.removeItem("access_token_admin")
  useEffect(() => {
    navigate("/admin/login")
  })
  return (
    <></>
  )
}

export default logoutPage