import { useEffect, useState } from "react";
import { Card, Col, Row, Spin } from "antd";
import {
  UserOutlined,
  AppstoreOutlined,
  GiftOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";

import AdminWrapper from "@/components/AdminWrapper";
import AppService from "@/services/AppService";
import useAsync from "@/hooks/useAsync";

interface DashboardData {
  totalCashUsers: number;
  totalItems: number;
  totalActiveOffers: number;
  totalCompletedBills: number;
}

export default function Dashboard() {


 const {
    data: dashboardData,
    loading,
  } = useAsync(AppService.getAdminDashboard);

  const data = dashboardData?.data ?? {};

//   console.log(dashboardData);

  const stats = [
    {
      title: "Cashier",
      value: data?.totalCashUsers ?? 0,
      icon: <UserOutlined />,
      color: "#1677ff",
    },
    {
      title: "Items",
      value: data?.totalItems ?? 0,
      icon: <AppstoreOutlined />,
      color: "#52c41a",
    },
    {
      title: "Active Offers",
      value: data?.totalActiveOffers ?? 0,
      icon: <GiftOutlined />,
      color: "#faad14",
    },
    {
      title: "Completed Bills",
      value: data?.totalCompletedBills ?? 0,
      icon: <FileDoneOutlined />,
      color: "#722ed1",
    },
  ];

  return (
    <AdminWrapper>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          {stats.map((s) => (
            <Col xs={24} sm={12} lg={6} key={s.title}>
              <Card
                bordered={false}
                className="shadow-sm"
                style={{ borderLeft: `4px solid ${s.color}` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm mb-1">{s.title}</p>
                    <h2 className="text-2xl font-semibold">{s.value}</h2>
                  </div>
                  <div
                    className="text-2xl"
                    style={{ color: s.color }}
                  >
                    {s.icon}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Spin>
    </AdminWrapper>
  );
}
