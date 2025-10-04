import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL + "/v1/cms",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
})

// optional request logger
api.interceptors.request.use((cfg) => {
  return cfg
})

export default api
