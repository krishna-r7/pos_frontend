import { useEffect, useMemo, useState } from "react";
import { Modal, Select, message, Typography } from "antd";
import useAsync from "@/hooks/useAsync";
import AppServices from "@/services/AppService";

const { Option } = Select;
const { Text } = Typography;

interface Props {
  open: boolean;
  onClose: () => void;
  refresh?: () => void;
  productId: string;
  assignedOffers?: any[]; 
}

export default function AssignOfferModal({
  open,
  onClose,
  refresh,
  productId,
  assignedOffers = [],
}: Props) {
  const [loading, setLoading] = useState(false);
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);

  const { data: offerResponse } = useAsync(AppServices.getAllOffers);


  const assignedOfferIds = useMemo(
    () => assignedOffers.map((o: any) => o._id),
    [assignedOffers]
  );


  const offerOptions = useMemo(() => {
    return (
      offerResponse?.data?.filter(
        (o: any) => !assignedOfferIds.includes(o._id)
      ) ?? []
    );
  }, [offerResponse, assignedOfferIds]);

 
  useEffect(() => {
    if (!open) {
      setSelectedOffers([]);
    }
  }, [open]);

 
  const handleAssign = async () => {
    if (!selectedOffers.length) {
      message.warning("Please select at least one offer");
      return;
    }

    try {
      setLoading(true);

      await AppServices.assignOffersToProduct({
        itemId: productId,
        offerId: selectedOffers,
      });

      message.success("Offers assigned successfully");
      refresh?.();
      onClose();
    } catch (error) {
      message.error("Failed to assign offers");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Assign Offer"
      open={open}
      onCancel={onClose}
      onOk={handleAssign}
      confirmLoading={loading}
      okText="Assign"
      destroyOnClose
    >
      <Text type="secondary">
        Select offers to assign to this product
      </Text>

      <Select
        style={{ width: "100%", marginTop: 16 }}
        mode="multiple"
        allowClear
        placeholder={
          offerOptions.length
            ? "Select offers"
            : "All offers already assigned"
        }
        disabled={!offerOptions.length}
        value={selectedOffers}
        onChange={setSelectedOffers}
      >
        {offerOptions.map((offer: any) => (
          <Option key={offer._id} value={offer._id}>
            {offer.name}
          </Option>
        ))}
      </Select>
    </Modal>
  );
}
