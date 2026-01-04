import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useAuthSubmit from "@/hooks/useAuthSubmit";

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const authSubmit = useAuthSubmit();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await authSubmit.onSubmit(values);
       
    } catch (error) {
      message.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 380,
          borderRadius: 8,
        }}
        bordered={false}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3} style={{ marginBottom: 4 }}>
            Welcome Back
          </Title>
          <Text type="secondary">Login to your account</Text>
        </div>

        <Form
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input
              size="large"
              prefix={<UserOutlined />}
              placeholder="you@example.com"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Password is required" },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="••••••••"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center" }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            © {new Date().getFullYear()} POS System
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Login;
