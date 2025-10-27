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
  Tag,
  Select,
} from "antd"
import { UploadOutlined } from "@ant-design/icons"
import employeeService from "../services/employee"
import dayjs from "dayjs"

export default function Employees() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [editing, setEditing] = useState(null)
  const [fileList, setFileList] = useState([])
  const [form] = Form.useForm()

  const load = async () => {
    setLoading(true)
    try {
      const data = await employeeService.getEmployees()
      setRows(data.rows || data || [])
    } catch (e) {
      message.error("Failed to load employees")
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
      employee_name: record.employee_name,
      status: record.status,
      role: record.role,
      join_date: record.join_date ? dayjs(record.join_date) : null,
      leave_date: record.leave_date ? dayjs(record.leave_date) : null,
      row_status: record.row_status,
    })
    setFileList(
      record.employee_image
        ? [{ uid: "-1", name: "image", url: record.employee_image }]
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
        employee_name: vals.employee_name,
        status: vals.status,
        role: vals.role,
        join_date: vals.join_date ? vals.join_date.format("YYYY-MM-DD") : null,
        leave_date: vals.leave_date
          ? vals.leave_date.format("YYYY-MM-DD")
          : null,
        row_status: vals.row_status,
        imageFile,
      }

      if (editing) {
        await employeeService.updateEmployee(editing.id, {
          ...payload,
          updated_by: "admin",
        })
        message.success("Employee updated")
      } else {
        await employeeService.createEmployee({
          ...payload,
          created_by: "admin",
        })
        message.success("Employee created")
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
      await employeeService.deleteEmployee(id)
      message.success("Deleted")
      load()
    } catch (e) {
      message.error("Delete failed")
    }
  }

  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "Name", dataIndex: "employee_name" },
    { title: "Role", dataIndex: "role" },
    {
      title: "Image",
      dataIndex: "employee_image",
      render: (v) =>
        v ? <Image src={v} width={80} style={{ borderRadius: 6 }} /> : null,
    },
    {
      title: "Join Date",
      dataIndex: "join_date",
      render: (v) => (v ? dayjs(v).format("YYYY-MM-DD") : "-"),
    },
    {
      title: "Leave Date",
      dataIndex: "leave_date",
      render: (v) => (v ? dayjs(v).format("YYYY-MM-DD") : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (v) =>
        v === "active" ? (
          <span style={{ color: "green", fontWeight: 500 }}>Active</span>
        ) : (
          <span style={{ color: "red", fontWeight: 500 }}>Inactive</span>
        ),
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
          New Employee
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
        title={editing ? "Edit Employee" : "Create Employee"}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="employee_name"
            label="Employee Name"
            rules={[{ required: true, message: "Please enter employee name" }]}
          >
            <Input placeholder="Enter employee name" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please enter role" }]}
          >
            <Input placeholder="Enter role" />
          </Form.Item>

          <Form.Item name="join_date" label="Join Date">
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="leave_date" label="Leave Date">
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Employee Image">
            <Upload {...uploadProps} maxCount={1}>
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editing ? "Save Changes" : "Create Employee"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  )
}
