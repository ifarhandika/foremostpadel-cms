import React, { useEffect, useState } from "react"
import AdminLayout from "../layouts/AdminLayout"
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Image,
  Popconfirm,
  DatePicker,
} from "antd"
import { UploadOutlined } from "@ant-design/icons"
import eventService from "../services/event"
import dayjs from "dayjs"

export default function Events() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [editing, setEditing] = useState(null)
  const [fileList, setFileList] = useState([])
  const [form] = Form.useForm()

  const load = async () => {
    setLoading(true)
    try {
      const data = await eventService.getEvents()
      setRows(data.rows || data || [])
    } catch (e) {
      message.error("Failed to load events")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openCreate = () => {
    form.resetFields()
    setEditing(null)
    setFileList([])
    setVisible(true)
  }

  const openEdit = (record) => {
    setEditing(record)
    form.setFieldsValue({
      event_name: record.event_name,
      notes: record.notes,
      description: record.description,
      location: record.location,
      time: record.time ? dayjs(record.time) : null,
    })
    setFileList(
      record.event_image
        ? [{ uid: "-1", name: "image", url: record.event_image }]
        : []
    )
    setVisible(true)
  }

  const onFinish = async (vals) => {
    try {
      const imageFile =
        fileList.length > 0 && fileList[0].originFileObj
          ? fileList[0].originFileObj
          : null

      const payload = {
        event_name: vals.event_name,
        notes: vals.notes,
        description: vals.description,
        time: vals.time ? vals.time.format("YYYY-MM-DD HH:mm:ss") : null,
        location: vals.location,
        imageFile,
      }

      if (editing) {
        await eventService.updateEvent(editing.id, {
          ...payload,
          updated_by: "admin",
        })
        message.success("Event updated")
      } else {
        await eventService.createEvent({
          ...payload,
          created_by: "admin",
        })
        message.success("Event created")
      }

      setVisible(false)
      load()
    } catch (e) {
      console.error(e)
      message.error("Save failed")
    }
  }

  const onDelete = async (id) => {
    try {
      await eventService.deleteEvent(id)
      message.success("Deleted")
      load()
    } catch (e) {
      message.error("Delete failed")
    }
  }

  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "Event Name", dataIndex: "event_name" },
    { title: "Notes", dataIndex: "notes" },
    { title: "Description", dataIndex: "description" },
    { title: "Time", dataIndex: "time" },
    { title: "Location", dataIndex: "location" },
    {
      title: "Image",
      dataIndex: "event_image",
      render: (v) =>
        v ? <Image src={v} width={100} style={{ borderRadius: 6 }} /> : null,
    },
    { title: "Created By", dataIndex: "created_by" },
    {
      title: "Actions",
      key: "actions",
      render: (_, r) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button onClick={() => openEdit(r)}>Edit</Button>
          <Popconfirm title="Delete?" onConfirm={() => onDelete(r.id)}>
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ]

  const uploadProps = {
    beforeUpload: () => false,
    onRemove: () => setFileList([]),
    onChange: (info) => setFileList(info.fileList.slice(-1)),
    fileList,
    listType: "picture",
  }

  return (
    <AdminLayout>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={openCreate}>
          New Event
        </Button>
      </div>

      <Table
        dataSource={rows}
        rowKey="id"
        columns={columns}
        loading={loading}
        scroll={{ x: true }}
      />

      <Modal
        title={editing ? "Edit Event" : "Create Event"}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        destroyOnClose>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="event_name"
            label="Event Name"
            rules={[{ required: true, message: "Please enter event name" }]}>
            <Input placeholder="Enter event name" />
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={2} placeholder="Enter notes" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Enter description" />
          </Form.Item>

          <Form.Item name="time" label="Time">
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item name="location" label="Location">
            <Input placeholder="Enter location" />
          </Form.Item>

          <Form.Item label="Event Image">
            <Upload {...uploadProps} maxCount={1}>
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editing ? "Save Changes" : "Create Event"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  )
}
