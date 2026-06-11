import React, { useState } from "react";
import { Collapse, Badge, Table, Tag } from "antd";
import { loanTypes, loans } from "../mock/data";
import { useNavigate } from "react-router-dom";

export default function Loans() {
    const [activeKey, setActiveKey] = useState(null);
    const navigate = useNavigate();

    // category бүрийн тоо
    const getCount = (typeId) =>
        loans.filter((l) => l.typeId === typeId).length;

    const getLoansByType = (typeId) =>
        loans.filter((l) => l.typeId === typeId);

    const columns = [
        {
        title: "Customer ID",
        dataIndex: "customerId",
        },
        {
        title: "Amount",
        dataIndex: "amount",
        },
        {
        title: "Balance",
        dataIndex: "balance",
        },
        {
        title: "Status",
        dataIndex: "status",
        render: (s) => (
            <Tag color={s === "ACTIVE" ? "green" : "gray"}>
            {s}
            </Tag>
        ),
        },
        {
        title: "Action",
        render: (_, record) => (
            <a
            onClick={() =>
                navigate(`/customers/${record.customerId}`)
            }
            >
            View
            </a>
        ),
        },
    ];

    return (
        <Collapse
        accordion
        onChange={(key) => setActiveKey(key)}
        >
        {loanTypes.map((type) => (
            <Collapse.Panel
            header={
                <span>
                {type.name}{" "}
                <Badge count={getCount(type.id)} />
                </span>
            }
            key={type.id}
            >
            <Table
                rowKey="id"
                dataSource={getLoansByType(type.id)}
                columns={columns}
                pagination={false}
            />
            </Collapse.Panel>
        ))}
        </Collapse>
    );
}