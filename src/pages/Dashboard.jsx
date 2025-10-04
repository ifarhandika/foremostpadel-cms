import React from 'react'
import AdminLayout from '../layouts/AdminLayout'
import { Card } from 'antd'

export default function Dashboard(){
  return (
    <AdminLayout>
      <Card title="Dashboard">
        <p>Welcome to Foremost Padel CMS.</p>
      </Card>
    </AdminLayout>
  )
}
