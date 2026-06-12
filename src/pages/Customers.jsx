import React, { useState } from "react";
import { Table, Input, Button, Space, Card } from "antd";
import { useNavigate } from "react-router-dom";

export default function Customers() {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const data = [
        { key: 1, id: 1, name: "Bat", phone: "99112233" },
        { key: 2, id: 2, name: "Saruul", phone: "88112233" },
    ];

    const filtered = data.filter(
        (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search)
    );

    const columns = [
        { title: "Нэр", dataIndex: "name" },
        { title: "Утас", dataIndex: "phone" },
        {
        title: "Action",
        render: (_, record) => (
            <Button onClick={() => navigate(`/customers/${record.id}`)}>
            View
            </Button>
        ),
        },
    ];

    return (
        <Card title="Customers">
        <Space style={{ marginBottom: 12 }}>
            <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />
        </Space>

        <Table columns={columns} dataSource={filtered} rowKey="key" />
        </Card>
    );
}