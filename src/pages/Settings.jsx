import { useState } from "react";
import {
    Card,
    Button,
    Form,
    Input,
    Modal,
    Space,
    Typography,
    message,
    Divider,
    } from "antd";
    import { useNavigate } from "react-router-dom";

    const { Title, Text } = Typography;

    export default function Settings() {
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);
    const [passwordOpen, setPasswordOpen] = useState(false);

    const [staff, setStaff] = useState({
        name: "Admin",
        role: "Зээлийн ажилтан",
        email: "admin@bbsb.mn",
        phone: "99112233",
    });

    const [form] = Form.useForm();

    const startEdit = () => {
        form.setFieldsValue(staff);
        setEditMode(true);
    };

    const saveInfo = (values) => {
        setStaff(values);
        setEditMode(false);
        message.success("Мэдээлэл шинэчлэгдлээ");
    };

    const logout = () => {
        localStorage.removeItem("token");
        message.success("Системээс гарлаа");
        navigate("/");
    };

    return (
        <>
        <Title level={3}>Тохиргоо</Title>

        <Card
            title="Ажилтны мэдээлэл"
            extra={
            !editMode && (
                <Button type="primary" onClick={startEdit}>
                Мэдээлэл шинэчлэх
                </Button>
            )
            }
        >
            {!editMode ? (
            <Space direction="vertical" size="middle">
                <Text><b>Нэр:</b> {staff.name}</Text>
                <Text><b>Албан тушаал:</b> {staff.role}</Text>
                <Text><b>И-мэйл:</b> {staff.email}</Text>
                <Text><b>Утас:</b> {staff.phone}</Text>

                <Button onClick={() => setPasswordOpen(true)}>
                Нууц үг өөрчлөх
                </Button>
            </Space>
            ) : (
            <Form form={form} layout="vertical" onFinish={saveInfo}>
                <Form.Item name="name" label="Нэр">
                <Input />
                </Form.Item>

                <Form.Item name="role" label="Албан тушаал">
                <Input />
                </Form.Item>

                <Form.Item name="email" label="И-мэйл">
                <Input />
                </Form.Item>

                <Form.Item name="phone" label="Утас">
                <Input />
                </Form.Item>

                <Space>
                <Button type="primary" htmlType="submit">
                    Хадгалах
                </Button>

                <Button onClick={() => setEditMode(false)}>
                    Болих
                </Button>
                </Space>
            </Form>
            )}
        </Card>

        <Card title="Системийн мэдээлэл" style={{ marginTop: 20 }}>
            <Space direction="vertical">
            <Text><b>Систем:</b> Loan Management System</Text>
            <Text><b>Хувилбар:</b> v1.0.0</Text>
            </Space>

            <Divider />

            <Button danger onClick={logout}>
            Logout
            </Button>
        </Card>

        <Modal
            title="Нууц үг өөрчлөх"
            open={passwordOpen}
            footer={null}
            onCancel={() => setPasswordOpen(false)}
        >
            <Form
            layout="vertical"
            onFinish={() => {
                message.success("Нууц үг шинэчлэгдлээ");
                setPasswordOpen(false);
            }}
            >
            <Form.Item label="Одоогийн нууц үг" name="oldPassword">
                <Input.Password />
            </Form.Item>

            <Form.Item label="Шинэ нууц үг" name="newPassword">
                <Input.Password />
            </Form.Item>

            <Form.Item label="Шинэ нууц үг давтах" name="confirmPassword">
                <Input.Password />
            </Form.Item>

            <Button type="primary" htmlType="submit" block>
                Хадгалах
            </Button>
            </Form>
        </Modal>
        </>
    );
}