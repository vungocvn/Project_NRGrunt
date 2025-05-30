import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
export default function OrderHistory() {
  interface Order {
    id: number;
    order_code: string;
    created_at: string;
    final_total: number;
    is_paid: number;
    is_canceled: number;
    is_confirmed: number;
    user?: {
      name?: string;
      phone?: string;
      address?: string;
    };
  }

  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const router = useRouter();

  function formatVND(amount: any) {
    const formatter = parseFloat(amount);
    return formatter.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }

  useEffect(() => {
    const token = Cookies.get("token_portal");
    if (!token) return;

    axios
      .get("http://localhost:8000/api/orders/my-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Requested-With": "XMLHttpRequest",
        },
      })
      .then((res) => {
        const data = res.data.data || res.data;
        setOrders(data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy lịch sử đơn hàng:", err);
      });
  }, []);

  const countByStatus = {
    all: orders.filter((o) => o.is_canceled === 0).length,
    pending: orders.filter((o) => o.is_confirmed === 0 && o.is_canceled === 0).length,
    confirm: orders.filter((o) => o.is_confirmed === 1 && o.is_paid === 0 && o.is_canceled === 0).length,
    done: orders.filter((o) => o.is_paid === 1 && o.is_confirmed === 1 && o.is_canceled === 0).length,
    cancel: orders.filter((o) => o.is_canceled === 1).length,
  };

  const statusFilter = (order: Order) => {
    if (filterStatus === "all") return order.is_canceled === 0;
    if (filterStatus === "pending") return order.is_confirmed === 0 && order.is_canceled === 0;
    if (filterStatus === "confirm") return order.is_confirmed === 1 && order.is_paid === 0 && order.is_canceled === 0;
    if (filterStatus === "done") return order.is_paid === 1 && order.is_confirmed === 1 && order.is_canceled === 0;
    if (filterStatus === "cancel") return order.is_canceled === 1;
    return true;
  };

  const getStatusText = (order: Order) => {
    if (order.is_canceled) return "Đã huỷ";
    if (order.is_paid && order.is_confirmed) return "Đã hoàn thành";
    if (order.is_confirmed) return "Đã xác nhận";
    return "Chờ xác nhận";
  };

  const handleCardClick = (orderId: number) => {
    router.push(`/invoice/${orderId}`);
  };

  const handleCancelOrder = async (e: React.MouseEvent, orderId: number) => {
    e.stopPropagation();
    const token = Cookies.get("token_portal");
    if (!token) return;

    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      await axios.post(
        `http://localhost:8000/api/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      );
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, is_canceled: 1 } : o))
      );
      toast.success("Order has been cancelled successfully.");
    } catch (error) {
      console.error("error in cancel order:", error);
      toast.error("Order cannot be cancelled. Please try again later.");
    }
  };

  return (
    <div className="history-container">
      <h2>Đơn hàng của tôi</h2>

      <div className="tab-status">
        {Object.entries(countByStatus).map(([key, value]) => (
          <button
            key={key}
            className={filterStatus === key ? "active" : ""}
            onClick={() => setFilterStatus(key)}
          >
            {key === "all" && `Tất cả (${value})`}
            {key === "pending" && `Chờ xác nhận (${value})`}
            {key === "confirm" && `Đã xác nhận (${value})`}
            {key === "done" && `Đã hoàn thành (${value})`}
            {key === "cancel" && `Đã huỷ (${value})`}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="empty">Chưa có đơn hàng nào.</p>
      ) : (
        <div className="order-list">
          {orders
            .filter(statusFilter)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((order) => (
              <div
                className="order-card"
                key={order.id}
                onClick={() => handleCardClick(order.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="order-header">
                  <div>
                    <span>Ngày {new Date(order.created_at).toLocaleDateString()} | </span>
                    <b>HD{order.id.toString().padStart(3, "0")}</b>
                  </div>
                  <span className={`status ${getStatusText(order).toLowerCase().replace(/\s/g, '-')}`}>
                    {getStatusText(order)}
                  </span>
                </div>

                <div className="order-info">
                  <p><strong>Khách hàng:</strong> {order.user?.name || "Không rõ"}</p>
                  <p><strong>SĐT:</strong> {order.user?.phone || "Không rõ"}</p>
                  <p><strong>Địa chỉ:</strong> {order.user?.address || "Không rõ"}</p>
                </div>

                <div className="order-footer">
                  <b>Thành tiền: {formatVND(order.final_total)}</b>
                  <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                    {!order.is_canceled && !order.is_paid && (
                      <button
                        className="btn-cancel"
                        onClick={(e) => handleCancelOrder(e, order.id)}
                      >
                        Huỷ đơn hàng
                      </button>
                    )}

                    {order.is_paid === 1 && order.is_confirmed === 1 && order.is_canceled === 0 && (
                      <button
                        className="btn-review" 
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/orders/${order.id}/review`);
                        }}
                      >
                        Đánh giá sản phẩm
                      </button>
                    )}

                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
