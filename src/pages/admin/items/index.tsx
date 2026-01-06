import AdminWrapper from "@/components/AdminWrapper";
import { Table, Tag, Image, Space, Button, Typography, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import useFilter from "@/hooks/useFiliter";
import AppService from "@/services/AppService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateOrUpdateModal from "@/pages/admin/items/components/createorupdateModal";
import AssignOfferModal from "@/pages/admin/items/components/assignmodal";



const { Title, Text } = Typography;

interface Product {
    _id: string;
    name: string;
    image: string;
    price: number;
    isActive: boolean;
    offers?: { name: string }[];

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
    } = useFilter(AppService.getAllItems, filterOptions);


    const [open, setOpen] = useState(false);
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);


    const handleAdd = () => {
        setSelectedProduct(null); // CREATE MODE
        setOpen(true);
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setOpen(true);
    };

    const handleAssignOffers = (product: Product) => {
        setSelectedProduct(product);
        setAssignModalOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedProduct(null);
    };

    const columns: ColumnsType<Product> = [
        {
            title: "Product",
            dataIndex: "name",
            key: "name",
            render: (_, record) => (
                <Space>
                    <Image
                        src={record.image}
                        width={48}
                        height={48}
                        style={{ borderRadius: 8 }}
                        preview={false}
                    />
                    <Text strong>{record.name}</Text>
                </Space>
            ),
        },

        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price: Product["price"]) => `₹${price.toFixed(2)}`,
        },
        {
            title: "Offers",
            dataIndex: "offers",
            key: "offers",
            render: (offers?: { name: string }[]) =>
                offers && offers.length > 0 ? (
                    <Space wrap>
                        {offers.map((offer, index) => (
                            <Tag key={index} color="blue">
                                {offer.name}
                            </Tag>
                        ))}
                    </Space>
                ) : (
                    <Text type="secondary">No Offer</Text>
                ),
        },
        {
            title: "Status",
            dataIndex: "isActive",
            key: "isActive",
            render: (isActive: Product["isActive"]) =>
                isActive === true ? (
                    <Tag color="green">Active</Tag>
                ) : (
                    <Tag color="red">Inactive</Tag>
                ),
        },
        {
            title: "Action",
            key: "action",
            align: "right",
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => handleAssignOffers(record)}>
                        Assign Offers
                    </Button>

                    <Button type="link" onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <AdminWrapper>
            <div style={{ padding: 24 }}>
                <div style={{ marginBottom: 16 }}>
                    <Title level={3} style={{ marginBottom: 0 }}>
                        Products
                    </Title>
                    <Text type="secondary">
                        Manage products, status and offers
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
                                placeholder="Search products..."
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
                                Add Product
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
                data={selectedProduct} // 👈 null = create, object = edit
                refresh={refresh}
            />
            <AssignOfferModal
                open={assignModalOpen}
                onClose={() => setAssignModalOpen(false)}
                refresh={refresh}
                productId={selectedProduct?._id || ""}
                assignedOffers={selectedProduct?.offers || []}
            />
        </AdminWrapper>


    );
}
