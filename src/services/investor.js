import api from "./api"

async function getInvestors() {
  const res = await api.get("/investors")
  return res.data.data || res.data || []
}

async function createInvestor({
  investor_name,
  role,
  company,
  imageFile,
  created_by,
}) {
  if (imageFile) {
    const fd = new FormData()
    fd.append("investor_name", investor_name)
    if (role) fd.append("role", role)
    if (company) fd.append("company", company)
    fd.append("investor_image", imageFile)
    fd.append("created_by", created_by)
    const res = await api.post("/investors", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return res.data
  } else {
    const res = await api.post("/investors", {
      investor_name,
      role,
      company,
      investor_image: "",
      created_by,
    })
    return res.data
  }
}

async function updateInvestor(
  id,
  { investor_name, role, company, imageFile, created_by }
) {
  if (imageFile) {
    const fd = new FormData()
    fd.append("investor_name", investor_name)
    if (role) fd.append("role", role)
    if (company) fd.append("company", company)
    fd.append("investor_image", imageFile)
    fd.append("created_by", created_by)
    const res = await api.put(`/investors/${id}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return res.data
  } else {
    const res = await api.put(`/investors/${id}`, {
      investor_name,
      role,
      company,
      created_by,
    })
    return res.data
  }
}

async function deleteInvestor(id) {
  return api.delete(`/investors/${id}`)
}

export default { getInvestors, createInvestor, updateInvestor, deleteInvestor }
