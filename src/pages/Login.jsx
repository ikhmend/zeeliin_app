import React from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = (values) => {
    if (values.username === "admin" && values.password === "admin123") {
      const userData = {
        username: values.username,
        token: "demo-token",
      };

      login(userData);

      message.success("Амжилттай нэвтэрлээ!");
      navigate("/dashboard");
    } else {
      message.error("Нэвтрэх мэдээлэл буруу байна!");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f0f2f5",
    }}>
      <Card style={{ width: 400 }}>
        <Title level={3} style={{ textAlign: "center" }}>
          ББСБ Систем
        </Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" rules={[{ required: true }]}>
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Login;