import { useState } from "react";
import AdminWrapper from "@/components/AdminWrapper";
import { Table, Tag, Typography, Button, Space, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import useFilter from "@/hooks/useFiliter";
import AppService from "@/services/AppService";
import AddCashierModal from "./components/create";



const { Title, Text } = Typography;

interface Cashier {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function Cashiers() {

  const filterOptions = { page: 1, limit: 10, };

  const {
    data,
    filters,
    refresh,
    updateFilter,
  } = useFilter(AppService.getAllCashier, filterOptions);

  const cashiers: Cashier[] = data?.data ?? [];
  const pagination = data?.pagination;
  const [open, setOpen] = useState(false);



  const columns: ColumnsType<Cashier> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color="blue">{role}</Tag>
      ),
    },

    {
      title: "Created On",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <AdminWrapper>
      <div style={{ padding: 24 }}>
        <Title level={3} style={{ marginBottom: 0 }}>
          Cashiers
        </Title>
        <Text type="secondary">
          Manage cashier accounts and access
        </Text>

        <div className="flex justify-end">
          <Space style={{ marginBottom: 24 }}>
            <Button type="primary" onClick={() => setOpen(true)}>
              Add Cashier
            </Button>
          </Space>
        </div>



        <Table
          style={{ marginTop: 24 }}
          rowKey="_id"
          columns={columns}
          dataSource={cashiers}
          pagination={{
            current: filterOptions?.page,
            pageSize: filterOptions?.limit,
            total: pagination?.total,
            onChange: (page, pageSize) => {
              updateFilter({
                ...filters,
                page,
                limit: pageSize,
              });
            },

          }}
          bordered
        />
      </div>
      <AddCashierModal
        open={open}
        onClose={() => setOpen(false)}
        refresh={refresh}
      />
    </AdminWrapper>
  );
}
