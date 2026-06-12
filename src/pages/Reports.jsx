import { Card, Row, Col, Table, Tag, Progress, Select } from "antd";
import { loans, customers, loanTypes } from "../mock/data";
import { useState } from "react";

export default function Reports() {
    const [status, setStatus] = useState("ALL");

    const filteredLoans =
        status === "ALL"
        ? loans
        : loans.filter((loan) => loan.status === status);

    const totalAmount = filteredLoans.reduce((sum, loan) => sum + loan.amount, 0);
    const totalBalance = filteredLoans.reduce((sum, loan) => sum + loan.balance, 0);
    const paidAmount = totalAmount - totalBalance;
    const paidPercent = totalAmount ? Math.round((paidAmount / totalAmount) * 100) : 0;

    const getCustomerName = (id) =>
        customers.find((c) => c.id === id)?.name || "-";

    const getLoanType = (id) =>
        loanTypes.find((t) => t.id === id)?.name || "-";

    const columns = [
        {
        title: "Харилцагч",
        dataIndex: "customerId",
        render: (id) => getCustomerName(id),
        },
        {
        title: "Зээлийн төрөл",
        dataIndex: "typeId",
        render: (id) => getLoanType(id),
        },
        {
        title: "Зээлийн дүн",
        dataIndex: "amount",
        render: (value) => `${value.toLocaleString()}₮`,
        },
        {
        title: "Төлөгдсөн",
        render: (_, record) =>
            `${(record.amount - record.balance).toLocaleString()}₮`,
        },
        {
        title: "Үлдэгдэл",
        dataIndex: "balance",
        render: (value) => `${value.toLocaleString()}₮`,
        },
        {
        title: "Төлөв",
        dataIndex: "status",
        render: (status) => (
            <Tag color={status === "ACTIVE" ? "green" : "default"}>
            {status === "ACTIVE" ? "Идэвхтэй" : "Хаагдсан"}
            </Tag>
        ),
        },
    ];

    return (
        <>
        <Card
            title="Зээлийн дэлгэрэнгүй тайлан"
            extra={
            <Select
                value={status}
                onChange={setStatus}
                style={{ width: 180 }}
                options={[
                { value: "ALL", label: "Бүх зээл" },
                { value: "ACTIVE", label: "Идэвхтэй" },
                { value: "CLOSED", label: "Хаагдсан" },
                ]}
            />
            }
        >
            <Row gutter={[20, 20]}>
            <Col xs={24} md={8}>
                <Card bordered={false}>
                <p>Нийт зээлийн дүн</p>
                <h2>{totalAmount.toLocaleString()}₮</h2>
                </Card>
            </Col>

            <Col xs={24} md={8}>
                <Card bordered={false}>
                <p>Төлөгдсөн дүн</p>
                <h2>{paidAmount.toLocaleString()}₮</h2>
                </Card>
            </Col>

            <Col xs={24} md={8}>
                <Card bordered={false}>
                <p>Үлдэгдэл</p>
                <h2>{totalBalance.toLocaleString()}₮</h2>
                </Card>
            </Col>
            </Row>

            <Card style={{ marginTop: 20 }}>
            <p>Зээлийн эргэн төлөлтийн явц</p>
            <Progress percent={paidPercent} />
            </Card>

            <Table
            style={{ marginTop: 20 }}
            rowKey="id"
            columns={columns}
            dataSource={filteredLoans}
            />
        </Card>
        </>
    );
}