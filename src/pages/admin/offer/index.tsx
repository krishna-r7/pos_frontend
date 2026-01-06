import AdminWrapper from "@/components/AdminWrapper";
import { Table, Tag, Space, Button, Typography, Input, Switch, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import useFilter from "@/hooks/useFiliter";
import AppService from "@/services/AppService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateOrUpdateModal from "@/pages/admin/offer/components/createorupdateModal";



const { Title, Text } = Typography;

interface Offer {
  _id: string;
  name: string;
  type: "PERCENTAGE" | "QUANTITY";
  discountPercent?: number;
  minQty?: number;
  discountAmount?: number;
  priority: number;
  isActive: boolean;
  validFrom?: string;
  validTo?: string;
}


export default function Products() {

  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const filterOptions = {
    page: 1,
    limit: 12,
    search: searchValue,

  }

  const {
    data: itemData,
    filters,
    updateFilter,
    refresh,
  } = useFilter(AppService.getAllOffers, filterOptions);


  const [open, setOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const handleAdd = () => {
    setSelectedOffer(null);
    setOpen(true);
  };

  const handleEdit = (offer: Offer) => {
    setSelectedOffer(offer);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOffer(null);
  };

  const handleStatusChange = async (offerId: string, isActive: boolean) => {
    try {
      updateFilter({ ...filters });
      await AppService.updateOfferStatus(offerId);
      refresh();

      message.success(`Offer ${isActive ? "activated" : "deactivated"} successfully`);
    } catch {
      message.error("Failed to update offer status");
    }
  };



  const columns: ColumnsType<Offer> = [
    {
      title: "Offer Name",
      dataIndex: "name",
      key: "name",
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={type === "PERCENTAGE" ? "blue" : "purple"}>
          {type}
        </Tag>
      ),
    },
    {
      title: "Discount",
      key: "discount",
      render: (_, record) =>
        record.type === "PERCENTAGE"
          ? `${record.discountPercent}%`
          : `Buy ${record.minQty} → Save ₹${record.discountAmount}`,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean, record: Offer) => (
        <Switch
          checked={isActive}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          onChange={(checked) => handleStatusChange(record._id, checked)}
        />
      ),
    },

    {
      title: "Validity",
      key: "validity",
      render: (_, record) =>
        record.validFrom && record.validTo
          ? `${new Date(record.validFrom).toLocaleDateString()} - ${new Date(
            record.validTo
          ).toLocaleDateString()}`
          : "—",
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   align: "right",
    //   render: (_, record) => (
    //     <Button type="link" onClick={() => handleEdit(record)}>
    //       Edit
    //     </Button>
    //   ),
    // },
  ];


  return (
    <AdminWrapper>
      <div style={{ padding: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <Title level={3} style={{ marginBottom: 0 }}>
            Products
          </Title>
          <Text type="secondary">
            Manage offers, status and details
          </Text>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              marginTop: 16,
              flexWrap: "wrap",
            }}
          >

            <Space size="middle">
              <Input.Search
                placeholder="Search ..."
                allowClear
                enterButton="Search"
                size="middle"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onSearch={() =>
                  updateFilter({
                    ...filters,
                    page: 1,
                    search: searchValue,
                  })
                }
                style={{ width: 280 }}
              />
            </Space>


            <Space>
              <Button type="primary" onClick={handleAdd}>
                Add Offer
              </Button>
            </Space>
          </div>

        </div>

        <Table
          rowKey="_id"
          columns={columns}
          dataSource={itemData?.data || []}
          pagination={{
            current: filterOptions.page, // current page from useFilter
            pageSize: filterOptions.limit, // page size from useFilter
            total: itemData?.total || 0, // total items from API
            // showSizeChanger: true,
            // pageSizeOptions: ['10', '20', '30', '50'],
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
      <CreateOrUpdateModal
        open={open}
        onClose={handleClose}
        data={selectedOffer}
        refresh={refresh}
      />
    </AdminWrapper>


  );
}
