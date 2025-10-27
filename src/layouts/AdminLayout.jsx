import React from 'react'
import { Layout, Menu, Button } from 'antd'
import { useAuth } from '../contexts/AuthContext'
import { Link, useLocation } from 'react-router-dom'

const { Header, Content, Sider } = Layout

export default function AdminLayout({ children }) {
  const { logout } = useAuth()
  const loc = useLocation()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div style={{ color: 'white', padding: 16, fontWeight: 'bold' }}>Foremost Padel CMS</div>
        <Menu theme="dark" mode="inline" selectedKeys={[loc.pathname]}>
          <Menu.Item key="/">
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="/court">
            <Link to="/court">Courts</Link>
          </Menu.Item>
          <Menu.Item key="/event">
            <Link to="/event">Events</Link>
          </Menu.Item>
          <Menu.Item key="/investor">
            <Link to="/investor">Investors</Link>
          </Menu.Item>
          <Menu.Item key="/employee">
            <Link to="/employee">Employees</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '0 16px' }}>
          <Button onClick={logout}>Logout</Button>
        </Header>
        <Content style={{ margin: 16 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
