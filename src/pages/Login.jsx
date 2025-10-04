import React from 'react'
import { Card, Form, Input, Button, message } from 'antd'
import { useAuth } from '../contexts/AuthContext'

export default function Login(){
  const { login } = useAuth()

  const onFinish = async (values) => {
    try{
      await login(values.user_name, values.password)
      message.success('Logged in')
    }catch(err){
      message.error(err?.message || 'Login failed')
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Card style={{ width: 360 }} title="Foremost Padel CMS - Login">
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item name="user_name" label="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Login</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
