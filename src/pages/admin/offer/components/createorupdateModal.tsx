import { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Card,
  Typography,
  Switch,
  DatePicker,
  message,
  Modal,
} from "antd";
import useAsync from "@/hooks/useAsync";
import useAppSubmit from "@/hooks/useAppSubmit";

const { Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const OfferType = {
  PERCENTAGE: "PERCENTAGE",
  QUANTITY: "QUANTITY",
} as const;

type OfferType = typeof OfferType[keyof typeof OfferType];

interface AddOfferModalProps {
  open: boolean;
  onClose: () => void;
  refresh?: () => void;
  data?: any;
}

export default function AddOfferModal({
  open,
  onClose,
  refresh,
  data,
}: AddOfferModalProps) {
  const [form] = Form.useForm();
  const [offerType, setOfferType] = useState<OfferType>();
  const { createOffer } = useAppSubmit();

  const isEdit = Boolean(data?._id);

  useEffect(() => {
    if (open && data) {
      form.setFieldsValue({
        ...data,
        validity: data.validFrom && data.validTo
          ? [data.validFrom, data.validTo]
          : undefined,
      });
      setOfferType(data.type);
    }

    if (!open) {
      form.resetFields();
      setOfferType(undefined);
    }
  }, [open, data, form]);

  const handleSubmit = async (values: any) => {
    try {

      isEdit
        ? await createOffer(values)
        : await createOffer(values);

      onClose();
      refresh?.();
    } catch {
      message.error("Failed to save offer");
    }
  };

  return (
    <Modal
      title={isEdit ? "Edit Offer" : "Add Offer"}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={isEdit ? "Update Offer" : "Create Offer"}
      destroyOnClose
      width={600}
    >
      <Text type="secondary">
        {isEdit
          ? "Update discount offer details"
          : "Create and configure discount offers"}
      </Text>

      <Card bordered={false} style={{ marginTop: 16 }}>
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          initialValues={{ isActive: true }}
        >
          {/* OFFER NAME */}
          <Form.Item
            label="Offer Name"
            name="name"
            rules={[{ required: true, message: "Enter offer name" }]}
          >
            <Input placeholder="e.g. New Year Sale" />
          </Form.Item>

          {/* OFFER TYPE */}
          <Form.Item
            label="Offer Type"
            name="type"
            rules={[{ required: true, message: "Select offer type" }]}
          >
            <Select
              placeholder="Select offer type"
              onChange={(value) => setOfferType(value)}
            >
              <Option value={OfferType.PERCENTAGE}>
                Percentage Discount
              </Option>
              <Option value={OfferType.QUANTITY}>
                Quantity Based Discount
              </Option>
            </Select>
          </Form.Item>

          {/* PERCENTAGE */}
          {offerType === OfferType.PERCENTAGE && (
            <Form.Item
              label="Discount Percentage (%)"
              name="discountPercent"

              rules={[
                { required: true, message: "Enter number" },
                {
                  type: "number",
                  min: 1,
                  message: "Discount percentage must be more than 0",
                },
                {
                  type: "number",
                  max: 100,
                  message: "Discount percentage must be less than 100",
                },
              ]}
            >
              <InputNumber min={1} max={100} style={{ width: "100%" }} />
            </Form.Item>
          )}

          {/* QUANTITY */}
          {offerType === OfferType.QUANTITY && (
            <>
              <Form.Item
                label="Minimum Quantity"
                name="minQty"
                rules={[
                  { required: true, message: "Enter number" },
                  { type: "number", message: "Must be a number" },
                ]}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="Discount Amount"
                name="discountAmount"
                rules={[
                  { required: true, message: "Enter number" },
                  { type: "number", message: "Must be a number" },
                ]}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </>
          )}

          {/* PRIORITY */}
          <Form.Item
            label="Priority"
            name="priority"
            tooltip="Lower number = higher priority"
            rules={[
              { required: true, message: "Enter priority" },
              {
                type: "number",
                min: 1,
                message: "Priority must be 1 or greater",
              },
            ]}
          >
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              placeholder="Enter priority"
            />
          </Form.Item>


          {/* ACTIVE */}
          <Form.Item label="Active" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>

          {/* VALIDITY */}
          <Form.Item label="Validity Period" name="validity">
            <RangePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
}
