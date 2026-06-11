import React from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("submitted", values);

    if (
      values.username === "admin" &&
      values.password === "admin123"
    ) {
      localStorage.setItem("token", "demo-token");

      console.log("token =", localStorage.getItem("token"));

      message.success("Амжилттай нэвтэрлээ!");
      navigate("/dashboard");
    } else {
      message.error("Нэвтрэх мэдээлэл буруу байна!");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Card
        style={{
          width: 400,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          <Title level={3}>ББСБ Систем</Title>
          <span style={{ color: "#8c8c8c" }}>Login</span>
        </div>

        <Form
          name="login_form"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Хэрэглэгчийн нэрээ оруулна уу!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Хэрэглэгчийн нэр (admin)"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Нууц үгээ оруулна уу!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Нууц үг (admin123)"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
              size="large"
            >
              Нэвтрэх
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;