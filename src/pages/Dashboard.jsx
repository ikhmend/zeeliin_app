import { Card, Row, Col, Statistic } from "antd";

export default function Dashboard() {
  return (
    <>
      <Row gutter={16}>
        <Col span={6}>
          <Card><Statistic title="Customers" value={120} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="Active Loans" value={45} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="Overdue" value={5} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="Revenue" value={12500000} /></Card>
        </Col>
      </Row>
    </>
  );
}