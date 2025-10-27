import api from "./api"

async function getEmployees() {
  const res = await api.get("/employees")
  return res.data.data || res.data || []
}

async function createEmployee({
  employee_name,
  role,
  join_date,
  leave_date,
  row_status,
  imageFile,
  created_by,
}) {
  if (imageFile) {
    const fd = new FormData()
    fd.append("employee_name", employee_name)
    if (role) fd.append("role", role)
    if (join_date) fd.append("join_date", join_date)
    if (leave_date) fd.append("leave_date", leave_date)
    if (row_status) fd.append("row_status", row_status)
    fd.append("employee_image", imageFile)
    fd.append("created_by", created_by)

    const res = await api.post("/employees", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return res.data
  } else {
    const res = await api.post("/employees", {
      employee_name,
      role,
      join_date,
      leave_date,
      row_status,
      employee_image: "",
      created_by,
    })
    return res.data
  }
}

async function updateEmployee(
  id,
  {
    employee_name,
    status,
    role,
    join_date,
    leave_date,
    row_status,
    imageFile,
    updated_by,
  }
) {
  if (imageFile) {
    const fd = new FormData()
    fd.append("employee_name", employee_name)
    if (role) fd.append("role", role)
    if (status) fd.append("status", status)
    if (join_date) fd.append("join_date", join_date)
    if (leave_date) fd.append("leave_date", leave_date)
    if (row_status) fd.append("row_status", row_status)
    fd.append("employee_image", imageFile)
    fd.append("updated_by", updated_by)

    const res = await api.put(`/employees/${id}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return res.data
  } else {
    const res = await api.put(`/employees/${id}`, {
      employee_name,
      status,
      role,
      join_date,
      leave_date,
      row_status,
      updated_by,
    })
    return res.data
  }
}

async function deleteEmployee(id) {
  return api.delete(`/employees/${id}`)
}

export default {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
}
