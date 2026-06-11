import { Input, Space } from "antd";

export default function SearchBar({
    search,
    setSearch,
    }) {
    return (
        <Space style={{ marginBottom: 16 }}>
        <Input
            placeholder="Нэр эсвэл утас..."
            value={search}
            onChange={(e) =>
            setSearch(e.target.value)
            }
        />
        </Space>
    );
}