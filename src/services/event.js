import api from "./api"

async function getEvents() {
  const res = await api.get("/events")
  return res.data.data || res.data || []
}

async function createEvent({
  event_name,
  notes,
  description,
  time,
  location,
  imageFile,
  created_by,
}) {
  if (imageFile) {
    const fd = new FormData()
    fd.append("event_name", event_name)
    if (notes) fd.append("notes", notes)
    if (description) fd.append("description", description)
    if (time) fd.append("time", time)
    if (location) fd.append("location", location)
    fd.append("event_image", imageFile)
    fd.append("created_by", created_by)

    const res = await api.post("/events", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return res.data
  } else {
    const res = await api.post("/events", {
      event_name,
      notes,
      description,
      time,
      location,
      event_image: "",
      created_by,
    })
    return res.data
  }
}

async function updateEvent(
  id,
  { event_name, notes, description, time, location, imageFile, updated_by }
) {
  if (imageFile) {
    const fd = new FormData()
    fd.append("event_name", event_name)
    if (notes) fd.append("notes", notes)
    if (description) fd.append("description", description)
    if (time) fd.append("time", time)
    if (location) fd.append("location", location)
    fd.append("event_image", imageFile)
    fd.append("updated_by", updated_by)

    const res = await api.put(`/events/${id}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return res.data
  } else {
    const res = await api.put(`/events/${id}`, {
      event_name,
      notes,
      description,
      time,
      location,
      updated_by,
    })
    return res.data
  }
}

async function deleteEvent(id) {
  return api.delete(`/events/${id}`)
}

export default { getEvents, createEvent, updateEvent, deleteEvent }
