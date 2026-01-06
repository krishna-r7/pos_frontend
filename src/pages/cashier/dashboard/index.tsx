import CashierWrapper from "@/components/CashierWrapper";
import { Button, Input, Pagination, Empty } from "antd";
import AppService from "@/services/AppService";
import useFilter from "@/hooks/useFiliter";
import useAsync from "@/hooks/useAsync";
import { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import useAppSubmit from "@/hooks/useAppSubmit";
import {  Trash2Icon } from "lucide-react";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [qtyMap, setQtyMap] = useState<Record<string, number>>({});

  type CartQtyEntry = {
    productId: string;
    quantity: number;
  };
  const [cartQtyMap, setCartQtyMap] = useState<Record<string, CartQtyEntry>>({});


  const cashierId = useSelector((state: RootState) => state.session?.userSession?.user?._id);
  const { addItemToBill } = useAppSubmit();

  // console.log(cashierId);

  const {
    data,
    filters,
    updateFilter,
    refresh,
    loading,
  } = useFilter(AppService.getItems, {
    page: 1,
    limit: 8,
    search: "",
  });

  const itemsData = data?.data ?? [];
  const pagination = data?.pagination;
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilter({
        ...filters,
        page: 1,
        limit: 8,
        search,
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);


  const { data: currentBillData, refresh: refreshCurrentBill } = useAsync(() => AppService.getCurrentBill(cashierId));

  const currentBill = currentBillData?.items ?? {};
  const subTotal = currentBillData?.subTotal || 0;
  const discount = currentBillData?.totalDiscount || 0;
  const finalPayableAmount = currentBillData?.finalPayableAmount || 0;
  const billId = currentBillData?.id;
  // console.log(billId);

  const getQty = (id: string) => qtyMap[id] ?? 1;

  const setProductQty = (id: string, value: number) => {
    setQtyMap((prev) => ({
      ...prev,
      [id]: Math.max(1, value),
    }));
  };

  const handleAddItem = async (id: string) => {
    const qty = getQty(id);
    await addItemToBill({
      cashierId: cashierId!,
      itemId: id,
      quantity: qty,
    });
    refreshCurrentBill();
    // console.log("qty,", qty);
  };

  const handleRemoveItem = async (id: string) => {
    await AppService.removeItemFromBill({
      billId: billId,
      itemId: id,
    });
    refreshCurrentBill();
  };


  const handleQuantityTyping = (
    billItemId: string,
    productId: string,
    value: number
  ) => {
    setCartQtyMap((prev) => ({
      ...prev,
      [billItemId]: {
        productId,
        quantity: Math.max(1, value),
      },
    }));
  };


  useEffect(() => {
    const timer = setTimeout(async () => {
      const entries = Object.entries(cartQtyMap);

      if (entries.length === 0 || !billId) return;

      for (const [billItemId, { productId, quantity }] of entries) {
        await AppService.updateBillItemQty({
          billId,
          itemId: billItemId,     // bill item id
          productId,              // product id (now available)
          quantity,
        });
      }

      refreshCurrentBill();

      setCartQtyMap({});
    }, 500);

    return () => clearTimeout(timer);
  }, [cartQtyMap, billId]);


  const handleGenerateBill = async () => {
    await AppService.generateBill(billId!);
    refreshCurrentBill();
  };

  return (
    <CashierWrapper>
      <div className="flex flex-col lg:flex-row h-full bg-white gap-5 p-3 lg:p-5">

        {/* ================= PRODUCTS ================= */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg lg:text-xl font-semibold text-slate-900">
              Products
            </h2>

            <Input
              allowClear
              placeholder="Search product..."
              prefix={<SearchOutlined />}
              className="!w-[280px] !border-2 !rounded-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* PRODUCT GRID */}
          <div className="
              grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
              gap-4
              lg:h-[calc(100vh-240px)]
              overflow-auto
              pr-1
            "
          >
            {loading ? (
              <div className="col-span-full text-center py-20">
                Loading products...
              </div>
            ) : itemsData.length === 0 ? (
              <div className="col-span-full">
                <Empty description="No products found" />
              </div>
            ) : (
              itemsData.map((p: any) => (
                <div
                  key={p.id}
                  className="
                    h-[280px]
                    group bg-slate-50 border border-slate-200
                    rounded-xl p-2 flex flex-col
                    hover:border-indigo-400 hover:shadow-md transition
                  "
                >
                  <div className="h-16 lg:h-24 flex items-center justify-center mb-2">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full object-contain group-hover:scale-105 transition"
                    />
                  </div>

                  <p className="text-xs lg:text-sm font-medium text-slate-800 text-center">
                    {p.name}
                  </p>

                  <p className="text-indigo-600 font-semibold text-center mt-1 text-sm">
                    ₹
                    {p.price}
                  </p>

                  <div className="flex items-center justify-center gap-2 mt-2 mb-2">
                    <Button
                      size="small"
                      className="!border-0 !rounded-lg"
                      onClick={() => setProductQty(p._id, getQty(p._id) - 1)}
                    >
                      −
                    </Button>

                    <Input
                      type="number"
                      min={1}
                      value={getQty(p._id)}
                      onChange={(e) =>
                        setProductQty(p.id, Number(e.target.value) || 1)
                      }
                      className="!w-[46px] !text-center !border-0 !rounded-lg"
                    />

                    <Button
                      size="small"
                      className="!border-0 !rounded-lg"
                      onClick={() => setProductQty(p._id, getQty(p._id) + 1)}
                    >
                      +
                    </Button>
                  </div>

                  <Button
                    type="primary"
                    size="small"
                    className="mt-2 !bg-emerald-500 hover:!bg-emerald-600 !border-0 !rounded-lg"
                    onClick={() => handleAddItem(p._id)}
                  >
                    Add to Cart
                  </Button>
                </div>
              ))
            )}
          </div>

          {pagination && pagination.totalItems > filters.limit && (
            <div className="flex justify-end ">
              <Pagination
                current={filters.page}
                pageSize={filters.limit}
                total={pagination.totalItems}
                showSizeChanger
                pageSizeOptions={["8", "12", "20", "40"]}
                onChange={(page, pageSize) =>
                  updateFilter({
                    ...filters,
                    page,
                    limit: pageSize,
                  })
                }
              />
            </div>
          )}

        </div>

        {/* ================= CART ================= */}
        <div
          className="
            w-full lg:w-[380px]
            bg-gradient-to-br from-indigo-600 to-violet-600
            rounded-2xl p-4 lg:p-5
            text-white flex flex-col shadow-xl
          "
        >
          <h2 className="text-lg lg:text-xl font-semibold mb-3">
            Cart
          </h2>

          {/* CART ITEMS */}
          <div
            className="
              flex-1 space-y-3 overflow-auto pr-1
              max-h-[240px] lg:max-h-none
            "
          >
            {currentBill.length === 0 ? (
              <div className="col-span-full">
                <Empty description="No products found" />
              </div>
            ) : (
              Array.from(currentBill).map((p: any) => (
                <div
                  key={p.id}
                  className="
                  bg-white text-slate-800 rounded-xl p-3
                  flex justify-between items-center shadow-sm
                "
                >
                  <div className="flex flex-col gap-1.5 flex-1">
                    {/* Item Name */}
                    <p className="text-sm font-semibold text-slate-900 leading-tight">
                      {p.itemName}
                    </p>

                    {/* Price & Quantity */}
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-slate-500">
                        Price{" "}
                        <span className="font-medium text-slate-700">
                          ₹
                          {p.unitPrice}
                        </span>
                      </span>

                      <span className="text-slate-500">
                        Qty{" "}
                        <span className="font-medium text-slate-700">
                          {p.quantity}
                        </span>
                      </span>
                    </div>

                    {/* Offer & Discount */}
                    <div className="flex items-center justify-between text-xs mt-1">
                      {p.availableOffer?.isApplied ? (
                        <>
                          {/* Applied Offer */}
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                            {p.availableOffer.offerName}
                          </span>

                          <span className="font-medium text-emerald-600">
                            − ₹
                            {p.availableOffer.discountAmount ?? 0}
                          </span>
                        </>
                      ) : (
                        <>
                          {/* No Offer */}
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                            No Offer
                          </span>

                          {/* Optional: hide discount completely */}
                          <span className="text-slate-400">
                            − ₹
                            0
                          </span>
                        </>
                      )}
                    </div>


                  </div>



                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      className="w-16 h-8 border border-slate-300 rounded-md text-center"
                      value={cartQtyMap[p._id]?.quantity ?? p.quantity}
                      onChange={(e) =>
                        handleQuantityTyping(p._id, p.itemId, Number(e.target.value) || 1)
                      }
                    />

                    <Button
                      danger
                      size="small"
                      className="!border-0 "
                      icon={<Trash2Icon />}
                      onClick={() => handleRemoveItem(p._id)}
                    />

                  </div>

                </div>
              ))
            )}
          </div>

          {/* SUMMARY */}
          <div className="bg-white text-slate-800 rounded-xl p-3 mt-4 space-y-1 text-sm shadow-sm mb-5">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹
                {subTotal}</span>
            </div>
            {/* <div className="flex justify-between">
              <span>Discount</span>
              <span>₹
 {currentBill?.tax || 0}</span>
            </div> */}
            <div className="flex justify-between">
              <span>Discount</span>
              <span>₹
                {discount}</span>
            </div>

            <hr className="my-2" />

            <div className="flex justify-between font-semibold text-indigo-700">
              <span>Total</span>
              <span>₹
                {finalPayableAmount}</span>
            </div>
          </div>
          {billId && (
            <Button
              type="primary"
              className="
                mt-4
                !bg-emerald-400 hover:!bg-emerald-500
                !border-0 !rounded-lg"
              onClick={handleGenerateBill}
            >
              Generate Bill
            </Button>
          )}
        </div>
      </div>
    </CashierWrapper>
  );
}
