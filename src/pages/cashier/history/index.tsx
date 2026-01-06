import { Card, Tag, Divider, Pagination } from "antd"
import { ClockCircleOutlined } from "@ant-design/icons"
import CashierWrapper from "@/components/CashierWrapper"
import useFilter from "@/hooks/useFiliter"
import AppService from "@/services/AppService"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"



export default function BillHistory() {
  const cashierId = useSelector((state: RootState) => state.session?.userSession?.user?._id)

  const { data, filters, updateFilter } = useFilter(AppService.getBillHistory, {
    page: 1,
    limit: 20,
    search: "",
    cashierId,
  })

  const bills = data?.bills ?? []
  const pagination = data?.pagination

  // console.log(pagination)


  return (
    <CashierWrapper>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {bills.map((bill: any) => {
          const totalItems = bill.items.reduce(
            (s: number, i: any) => s + i.quantity,
            0
          );

          return (
            <Card
              key={bill._id}
              className="rounded-2xl  shadow-sm hover:shadow-md transition"
              bodyStyle={{ padding: 10 }}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-mono text-slate-400">
                  #{bill._id.slice(-6)}
                </span>

                <Tag
                  color="success"
                  className="!rounded-full !px-3 !py-0.5 !text-xs"
                >
                  PAID
                </Tag>
              </div>

              {/* Total Box */}
              <div className="bg-blue-50 rounded-xl py-2 text-center mb-4">
                <p className="text-xs text-slate-500 mb-1">Total</p>
                <p className="text-2xl font-semibold text-indigo-600">
                  ₹
                  {bill.finalPayableAmount.toFixed(2)}
                </p>
              </div>

              {/* Items count + discount */}
              <div className="flex justify-between text-xs text-slate-600 mb-2">
                <span>🛒 {totalItems} items</span>

                {bill.totalDiscount > 0 && (
                  <span className="text-emerald-600">
                    − ₹
                    {bill.totalDiscount}
                  </span>
                )}
              </div>

              <Divider className="my-2" />

              {/* Item list */}
              <div className="space-y-2 text-sm">
                {bill.items.slice(0, 3).map((item: any) => (
                  <div
                    key={item._id}
                    className="flex justify-between text-slate-700"
                  >
                    <span>
                      {item.itemName} ×{item.quantity}
                    </span>
                    <span>₹
                      {item.finalItemTotal}</span>
                  </div>
                ))}

                {bill.items.length > 3 && (
                  <div className="text-xs text-slate-400">
                    +{bill.items.length - 3} more
                  </div>
                )}
              </div>

              <Divider className="my-3" />

              {/* Footer */}
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <ClockCircleOutlined />
                  {new Date(bill.generatedAt).toLocaleDateString()}
                </span>

                <span>
                  {new Date(bill.generatedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </Card>
          );
        })}
        
      </div>
      
      {/* Pagination */}
      {pagination?.total > 0 && (
        <div className="flex justify-end mt-6">
          <Pagination
            current={filters.page}
            pageSize={filters.limit}
            total={pagination.total}
            showSizeChanger
            pageSizeOptions={["8", "10", "20", "36"]}
            showTotal={(total) => `Total ${total} bills`}
            onChange={(page, pageSize) => {
              updateFilter({
                ...filters,
                page,
                limit: pageSize,
              })
            }}
          />
        </div>
      )}

    </CashierWrapper>
  );
}
