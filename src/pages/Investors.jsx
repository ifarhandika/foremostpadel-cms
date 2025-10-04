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
import investorService from "../services/investor"

export default function Investors() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [editing, setEditing] = useState(null)
  const [fileList, setFileList] = useState([])
  const [form] = Form.useForm()

  const load = async () => {
    setLoading(true)
    try {
      const res = await investorService.getInvestors()
      console.log("getInvestors", res)
      setRows(res.rows || [])
    } catch (e) {
      message.error("Failed to load investors")
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
      investor_name: record.investor_name,
      role: record.role,
      company: record.company,
    })
    setFileList(
      record.investor_image
        ? [{ uid: "-1", name: "image", url: record.investor_image }]
        : []
    )
    setVisible(true)
  }

  const onFinish = async (vals) => {
    try {
      const file = fileList[0]?.originFileObj
      const payload = {
        investor_name: vals.investor_name,
        role: vals.role,
        company: vals.company,
        imageFile: file,
        created_by: "admin",
      }

      if (editing) {
        await investorService.updateInvestor(editing.id, payload)
        message.success("Investor updated")
      } else {
        await investorService.createInvestor(payload)
        message.success("Investor created")
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
      await investorService.deleteInvestor(id)
      message.success("Deleted")
      load()
    } catch (e) {
      message.error("Delete failed")
    }
  }

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Name", dataIndex: "investor_name" },
    { title: "Role", dataIndex: "role" },
    { title: "Company", dataIndex: "company" },
    {
      title: "Image",
      dataIndex: "investor_image",
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
    beforeUpload: () => false,
    onRemove: () => setFileList([]),
    onChange: (info) => setFileList(info.fileList.slice(-1)),
    fileList,
  }

  return (
    <AdminLayout>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={openCreate}>
          New Investor
        </Button>
      </div>

      <Table
        dataSource={rows}
        rowKey="id"
        columns={columns}
        loading={loading}
      />

      <Modal
        title={editing ? "Edit Investor" : "Create Investor"}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="investor_name"
            label="Investor Name"
            rules={[{ required: true, message: "Please input investor name" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role">
            <Input />
          </Form.Item>
          <Form.Item name="company" label="Company">
            <Input />
          </Form.Item>

          <Form.Item label="Investor Image">
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
