import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";

export default function OrderHistory() {
  interface Order {
    id: number;
    order_code: string;
    created_at: string;
    final_total: number;
    is_paid: number;
    is_canceled: number;
  }

  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");

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
        setOrders(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy lịch sử đơn hàng:", err);
      });
  }, []);

  const statusFilter = (order: Order) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "0") return order.is_paid === 0 && order.is_canceled === 0;
    if (filterStatus === "1") return order.is_paid === 1 && order.is_canceled === 0;
    if (filterStatus === "2") return order.is_canceled === 1;
    return true;
  };

  const getStatusText = (order: Order) => {
    if (order.is_canceled) return "Đã huỷ";
    if (order.is_paid) return "Đã hoàn thành";
    return "Xác nhận đơn";
  };

  return (
    <div className="history-container">
      <h2>Lịch sử đơn hàng</h2>

      <div style={{ marginBottom: 16 }}>
        <label style={{ marginRight: 8 }}>Lọc theo trạng thái:</label>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">Tất cả</option>
          <option value="0">Xác nhận đơn</option>
          <option value="1">Đã hoàn thành</option>
          <option value="2">Đã huỷ</option>
        </select>
      </div>

      {orders.length === 0 ? (
        <p className="empty">Chưa có đơn hàng nào.</p>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Xem</th>
            </tr>
          </thead>
          <tbody>
            {orders
              .filter(statusFilter)
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((order) => (
                <tr key={order.id}>
                  <td>HD{order.id.toString().padStart(3, "0")}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>{formatVND(order.final_total)}</td>
                  <td>{getStatusText(order)}</td>
                  <td>
                    <Link href={`/invoice/${order.id}`} className="view-link">
                      Xem hóa đơn
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
