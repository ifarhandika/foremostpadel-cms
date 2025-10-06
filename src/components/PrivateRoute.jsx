import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Spin, Typography, Space } from "antd"
import { LoadingOutlined } from "@ant-design/icons"

const { Text } = Typography

export default function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated === null) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f9fafb",
        }}
      >
        <Space direction="vertical" align="center">
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 36, color: "#1677ff" }} spin />}
            size="large"
          />
          <Text type="secondary" style={{ fontSize: 16 }}>
            Loading...
          </Text>
        </Space>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
