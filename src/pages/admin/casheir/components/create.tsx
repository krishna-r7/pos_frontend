import { useEffect } from "react";
import {
  Form,
  Input,
  Card,
  Typography,
  Switch,
  Modal,
  message,
} from "antd";
import useAppSubmit from "@/hooks/useAppSubmit";

const { Text } = Typography;

interface AddCashierModalProps {
  open: boolean;
  onClose: () => void;
  refresh?: () => void;
}

export default function AddCashierModal({
  open,
  onClose,
  refresh,
}: AddCashierModalProps) {
  const [form] = Form.useForm();

  const { createCashier } = useAppSubmit(); 

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleSubmit = async (values: any) => {
    try {
     
      await createCashier(values);
      refresh?.();
      onClose();
    } catch {
      message.error("Failed to create cashier");
    }
  };

  return (
    <Modal
      title="Add Cashier"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Create Cashier"
      destroyOnClose
      width={500}
    >
      <Text type="secondary">
        Create a new cashier account
      </Text>

      <Card bordered={false} style={{ marginTop: 16 }}>
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          initialValues={{ isActive: true }}
        >
          
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Enter name" }]}
          >
            <Input placeholder="Cashier name" />
          </Form.Item>

          
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Enter email" },
              { type: "email", message: "Enter valid email" },
            ]}
          >
            <Input placeholder="cashier@email.com" />
          </Form.Item>

       
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Enter password" },
              { min: 6, message: "Minimum 6 characters" },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

         
        </Form>
      </Card>
    </Modal>
  );
}
