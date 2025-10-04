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
} from "antd"
import { UploadOutlined } from "@ant-design/icons"
import courtService from "../services/court"

export default function Courts() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [editing, setEditing] = useState(null)
  const [fileList, setFileList] = useState([])
  const [form] = Form.useForm()

  const load = async () => {
    setLoading(true)
    try {
      const res = await courtService.getCourts()
      console.log("getCourts", res)
      setRows(res.rows || [])
    } catch (e) {
      message.error("Failed to load courts")
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
    form.setFieldsValue({ court_name: record.court_name })
    setFileList(
      record.court_image
        ? [{ uid: "-1", name: "image", url: record.court_image }]
        : []
    )
    setVisible(true)
  }

  const onFinish = async (vals) => {
    try {
      const file = fileList[0]?.originFileObj
      if (editing) {
        await courtService.updateCourt(editing.id, {
          court_name: vals.court_name,
          imageFile: file,
          created_by: "admin",
        })
        message.success("Court updated")
      } else {
        await courtService.createCourt({
          court_name: vals.court_name,
          imageFile: file,
          created_by: "admin",
        })
        message.success("Court created")
      }
      setVisible(false)
      load()
    } catch (e) {
      message.error("Save failed")
    }
  }

  const onDelete = async (id) => {
    try {
      await courtService.deleteCourt(id)
      message.success("Deleted")
      load()
    } catch (e) {
      message.error("Delete failed")
    }
  }

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Name", dataIndex: "court_name" },
    {
      title: "Image",
      dataIndex: "court_image",
      render: (v) => (v ? <Image src={v} width={120} /> : null),
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
    beforeUpload: (file) => {
      // prevent auto upload
      return false
    },
    onRemove: (file) => {
      setFileList([])
    },
    onChange: (info) => {
      let fl = info.fileList.slice(-1)
      setFileList(fl)
    },
    fileList,
  }

  return (
    <AdminLayout>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={openCreate}>
          New Court
        </Button>
      </div>

      <Table
        dataSource={rows}
        rowKey="id"
        columns={columns}
        loading={loading}
      />

      <Modal
        title={editing ? "Edit Court" : "Create Court"}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="court_name"
            label="Court name"
            rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Court image">
            <Upload {...uploadProps} maxCount={1} listType="picture">
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editing ? "Save" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  )
}
