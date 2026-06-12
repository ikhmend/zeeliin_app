import { Card, Form, Input, Button } from "antd";

export default function Payments() {
return (
<Card title="Payment">
    <Form layout="vertical">
    <Form.Item label="Customer">
        <Input />
    </Form.Item>

    <Form.Item label="Amount">
        <Input />
    </Form.Item>

    <Button type="primary">Submit Payment</Button>
    </Form>
</Card>
);
}