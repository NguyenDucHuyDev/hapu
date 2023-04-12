import axios from "axios";


const instance = axios.create({
  baseURL: import.meta.env.VITE_MY_API_PATH
})


instance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("access_token")}`
  return config
})

instance.interceptors.response.use((response) => {
  return response
},
(error) => {
  // Handle error here
  if(error?.response?.data) {
    return error.response
  }
  return Promise.reject(error)
}
)

export default instance