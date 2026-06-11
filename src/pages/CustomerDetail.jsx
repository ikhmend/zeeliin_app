import React from "react";
import { Card, Tag, Table, Progress } from "antd";
import { useParams } from "react-router-dom";
import { customers, loans, payments } from "../mock/data";

export default function CustomerDetail() {
    const { id } = useParams();

    const customer = customers.find((c) => c.id === Number(id));
    const loan = loans.find(
        (l) => l.customerId === Number(id) && l.status === "ACTIVE"
    );

    const customerPayments = payments.filter(
        (p) => p.loanId === loan?.id
    );

    if (!customer) return <div>Customer not found</div>;

    const risk =
        customer.score >= 700
        ? "LOW RISK"
        : customer.score >= 500
        ? "MEDIUM"
        : "HIGH RISK";

    const paymentColumns = [
        { title: "Огноо", dataIndex: "date" },
        { title: "Дүн", dataIndex: "amount" },
        { title: "Үндсэн", dataIndex: "principal" },
        { title: "Хүү", dataIndex: "interest" },
        { title: "Үлдэгдэл", dataIndex: "balance" },
    ];

    return (
        <div>
        <Card title="Customer Info">
            <p>Нэр: {customer.name}</p>
            <p>Утас: {customer.phone}</p>
            <p>Регистр: {customer.register}</p>

            <h3>Score: {customer.score}</h3>
            <Progress percent={customer.score / 10} />
            <Tag color="blue">{risk}</Tag>
        </Card>

        <Card title="Active Loan" style={{ marginTop: 20 }}>
            {loan ? (
            <>
                <p>Amount: {loan.amount}</p>
                <p>Balance: {loan.balance}</p>
                <Tag color="green">ACTIVE</Tag>
            </>
            ) : (
            <Tag color="red">NO ACTIVE LOAN</Tag>
            )}
        </Card>

        <Card title="Payment History" style={{ marginTop: 20 }}>
            <Table
            dataSource={customerPayments}
            columns={paymentColumns}
            rowKey="id"
            pagination={false}
            />
        </Card>
        </div>
    );
}