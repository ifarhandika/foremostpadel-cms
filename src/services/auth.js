import api from './api'

async function login(user_name, password){
  const res = await api.post('/login', { user_name, password })
  return res.data
}

async function logout(){
  // call backend endpoint to clear cookie if exists
  try { await api.post('/logout') } catch(e){ /* ignore */ }
}

export default { login, logout }
