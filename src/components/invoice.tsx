import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Invoice() {
  const [bill, setBill] = useState<any | null>(null);
  const router = useRouter();

  async function getOrderDetailsByOrderId(id: number) {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/detail-orders/?order_id=${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token_portal")}`
        }
      });

      if (res.data.status === 200 || res.data.status === 201) {
        return res.data.data;
      }
      return [];
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      return [];
    }
  }

  useEffect(() => {
    const storedInvoice = localStorage.getItem("invoice");
    if (storedInvoice) {
      const invoice = JSON.parse(storedInvoice);
      getOrderDetailsByOrderId(invoice.id).then((details) => {
        setBill({
          ...invoice,
          vat: 0.05 * invoice.total_price,
          shipping_fee: 30000,
          final_total: invoice.total_price + 0.05 * invoice.total_price + 30000,
          details,
          customer_info: invoice.customer_info || {}
        });
      });
    }
  }, []);

  function formatVND(amount: any) {
    if (!amount || isNaN(amount)) return "0 ₫";
    return parseFloat(amount).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  }

  if (!bill) return <p>Đang tải hóa đơn...</p>;

  return (
    <div>
      <div id="invoice" className="invoice">
        <h2 style={{ textAlign: "center", color: "#01ab78" }}>HÓA ĐƠN THANH TOÁN</h2>

        {/* Thông tin khách hàng */}
        <div className="customer-info" style={{ marginBottom: "20px" }}>
          <p><strong>Tên khách hàng:</strong> {bill.customer_info?.name || "Chưa rõ"}</p>
          <p><strong>SĐT:</strong> {bill.customer_info?.phone || "Chưa rõ"}</p>
          <p><strong>Địa chỉ:</strong> {bill.customer_info?.address || "Chưa rõ"}</p>
        </div>

        {bill.details?.map((detail: any) => (
          <div key={detail.id} className="product-row">
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={`http://127.0.0.1:8000${detail.image}`}
                alt={detail.product_name}
                className="product-image"
              />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: "bold" }}>{detail.product_name}</p>
                <p style={{ margin: 0 }}>Số lượng: {detail.quantity}</p>
              </div>
            </div>
            <div className="product-price">
              <p style={{ margin: 0 }}>Giá: {formatVND(detail.unit_price)}</p>
              <p style={{ margin: 0 }}>Tổng: {formatVND(parseFloat(detail.unit_price) * detail.quantity)}</p>
            </div>
          </div>
        ))}

        <div className="invoice-summary">
          <h4>
            Đơn hàng #{bill.id} - <span style={{ color: "#999" }}>{bill.order_code}</span>
          </h4>
          <p>Tổng giá: {formatVND(bill.total_price)}</p>
          <p>VAT (5%): {formatVND(bill.vat)}</p>
          <p style={{ textAlign: "right" }}>Phí vận chuyển: {formatVND(bill.shipping_fee)}</p>
          <p style={{ fontWeight: "bold", color: "#c0392b", textAlign: "right" }}>
            Thành tiền: {formatVND(bill.final_total)}
          </p>
        </div>

        {/* Nút quay lại trang chủ */}
        <div style={{ textAlign: "center", marginTop: 30 }}>
          <button
            onClick={() => router.push("/shop")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#01ab78",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  );
}
