import api from './api'

async function getCourts(){
  const res = await api.get('/courts')
  return res.data.data || res.data || []
}

async function createCourt({ court_name, imageFile, created_by }){
  if(imageFile){
    const fd = new FormData()
    fd.append('court_name', court_name)
    fd.append('court_image', imageFile)
    fd.append('created_by', created_by)
    const res = await api.post('/courts', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    return res.data
  } else {
    const res = await api.post('/courts', { court_name, court_image: '', created_by })
    return res.data
  }
}

async function updateCourt(id, { court_name, imageFile, created_by }){
  if(imageFile){
    const fd = new FormData()
    fd.append('court_name', court_name)
    fd.append('court_image', imageFile)
    fd.append('created_by', created_by)
    const res = await api.put(`/courts/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    return res.data
  } else {
    const res = await api.put(`/courts/${id}`, { court_name, created_by })
    return res.data
  }
}

async function deleteCourt(id){
  return api.delete(`/courts/${id}`)
}

export default { getCourts, createCourt, updateCourt, deleteCourt }
