import { Card, Row, Col, Statistic, Table, Tag } from "antd";
import { customers, loans } from "../mock/data";

export default function Dashboard() {
  const activeLoans = loans.filter((loan) => loan.status === "ACTIVE");
  const closedLoans = loans.filter((loan) => loan.status === "CLOSED");

  const cardStyle = (color) => ({
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    borderLeft: `5px solid ${color}`,
  });

  const columns = [
    { title: "Харилцагч ID", dataIndex: "customerId" },
    {
      title: "Зээлийн дүн",
      dataIndex: "amount",
      render: (value) => `${value.toLocaleString()}₮`,
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
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={cardStyle("#1677ff")}>
            <Statistic title="Нийт харилцагч" value={customers.length} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={cardStyle("#52c41a")}>
            <Statistic title="Идэвхтэй зээл" value={activeLoans.length} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={cardStyle("#faad14")}>
            <Statistic title="Хаагдсан зээл" value={closedLoans.length} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={cardStyle("#ff4d4f")}>
            <Statistic title="Хугацаа хэтэрсэн" value={0} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card
            title="Сүүлийн зээлүүд"
            style={{
              borderRadius: "16px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            }}
          >
            <Table
              rowKey="id"
              columns={columns}
              dataSource={loans}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}