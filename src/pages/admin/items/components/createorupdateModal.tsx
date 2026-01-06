import { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Upload,
  Select,
  Card,
  Typography,
  message,
  Modal,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import useAppSubmit from "@/hooks/useAppSubmit";
import useAsync from "@/hooks/useAsync";
import AppServices from "@/services/AppService";

const { Text } = Typography;
const { Option } = Select;

export default function CreateOrUpdateModal({
  open,
  onClose,
  refresh,
  data,
}: any) {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(data?._id);

  const { createProduct } = useAppSubmit();

  const { data: offerResponse } = useAsync(AppServices.getAllOffers);

  const offerOptions =
    offerResponse?.data?.map((o: any) => ({
      id: o._id,
      name: o.name,
    })) ?? [];


  useEffect(() => {
    if (open && data) {
      form.setFieldsValue({
        name: data.name,
        price: data.price,
        offers: data.offers?.map((o: any) => o._id),
      });
    }

    if (!open) {
      form.resetFields();
      setImageFile(null);
    }
  }, [open, data, form]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", String(values.price));
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (values.offers?.length) {
        formData.append("offerId", JSON.stringify(values.offers));
      }

      if (isEdit) {
        await AppServices.updateProduct(formData, data._id);
        message.success("Product updated successfully");
      } else {
        await createProduct(formData);

      }

      refresh?.();
      onClose();
    } catch (error) {
      message.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Modal
      title={isEdit ? "Edit Product" : "Add Product"}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText={isEdit ? "Update Product" : "Add Product"}
      destroyOnClose
    >
      <Text type="secondary">
        {isEdit
          ? "Update product details"
          : "Create a new product and assign offers"}
      </Text>

      <Card bordered={false} style={{ marginTop: 16 }}>
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Product Name"
            name="name"
            rules={[{ required: true, message: "Enter product name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[
              { required: true, message: "Enter price" },
              {
                type: "number",
                min: 1,
                message: "Price must be more than 0",
              },
            ]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Product Image">
            <Upload
              beforeUpload={(file) => {
                setImageFile(file);
                return false;
              }}
              maxCount={1}
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>
                {isEdit ? "Change Image" : "Upload Image"}
              </Button>
            </Upload>
          </Form.Item>

          {!isEdit && (
             <Form.Item label="Offers" name="offers">
            <Select mode="multiple" allowClear>
              {offerOptions.map((offer: any) => (
                <Option key={offer.id} value={offer.id}>
                  {offer.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          )}

        </Form>
      </Card>
    </Modal>
  );
}
