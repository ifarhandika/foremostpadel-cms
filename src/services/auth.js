import api from "./api"

async function login(user_name, password) {
  const res = await api.post("/login", { user_name, password })
  return res.data
}

async function logout() {
  try {
    await api.post("/logout")
  } catch (e) {}
}

async function checkAuth() {
  try {
    const res = await api.get("/check-auth")
    return res.data
  } catch (e) {
    return { success: false }
  }
}

export default { login, logout, checkAuth }
