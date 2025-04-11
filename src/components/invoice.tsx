import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setCount } from "@/store/slices/productsSlice";

export default function Invoice() {
  const [bill, setBill] = useState<any | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;

  // Hàm lấy chi tiết đơn hàng theo order_id
  async function getOrderDetailsByOrderId(orderId: number) {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/detail-orders/?order_id=${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token_portal")}`
          }
        }
      );

      if (res.data.status === 200 || res.data.status === 201) {
        return res.data.data;
      }
      return [];
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      return [];
    }
  }

  // useEffect xử lý hiển thị từ localStorage hoặc từ ID (route param)
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
    } else if (id) {
      const token = Cookies.get("token_portal");

      axios
        .get(`http://127.0.0.1:8000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const invoice = res.data.data;
          getOrderDetailsByOrderId(invoice.id).then((details) => {
            setBill({
              ...invoice,
              vat: 0.05 * invoice.total_price,
              shipping_fee: 30000,
              final_total: invoice.total_price + 0.05 * invoice.total_price + 30000,
              details,
              customer_info: {
                name: invoice.user?.name || "Không rõ",
                phone: invoice.phone || "Không rõ",
                address: invoice.address || "Không rõ",
              },
            });
          });
        })
        .catch((err) => console.error("Lỗi khi gọi lại hóa đơn từ ID:", err));
    }
  }, [id]);

  function formatVND(amount: any) {
    if (!amount || isNaN(amount)) return "0 ₫";
    return parseFloat(amount).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }

  if (!bill) return <p>Đang tải hóa đơn...</p>;

  return (
    <div style={{ padding: "30px", maxWidth: 800, margin: "0 auto" }}>
      <div id="invoice" className="invoice">
        <h2 style={{ textAlign: "center", color: "#01ab78" }}>HÓA ĐƠN THANH TOÁN</h2>

        <div className="customer-info" style={{ marginBottom: "20px" }}>
          <p><strong>Tên khách hàng:</strong> {bill.customer_info?.name}</p>
          <p><strong>SĐT:</strong> {bill.customer_info?.phone}</p>
          <p><strong>Địa chỉ:</strong> {bill.customer_info?.address}</p>
        </div>

        {bill.details?.map((detail: any) => (
          <div key={detail.id} className="product-row" style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #eee",
            padding: "10px 0"
          }}>
            <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <img
                src={`http://127.0.0.1:8000${detail.image}`}
                alt={detail.product_name}
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  marginRight: 16,
                  borderRadius: 4,
                  border: "1px solid #ddd"
                }}
              />
              <div>
                <p style={{ margin: 0, fontWeight: "bold" }}>{detail.product_name}</p>
                <p style={{ margin: 0 }}>Số lượng: {detail.quantity}</p>
              </div>
            </div>
            <div style={{ textAlign: "right", minWidth: 150 }}>
              <p style={{ margin: 0 }}>Giá: {formatVND(detail.unit_price)}</p>
              <p style={{ margin: 0 }}>
                Tổng: {formatVND(parseFloat(detail.unit_price) * detail.quantity)}
              </p>
            </div>
          </div>
        ))}

        <div className="invoice-summary" style={{ marginTop: 30 }}>
          <h4>
            Đơn hàng #{bill.id} - <span style={{ color: "#888" }}>{bill.order_code}</span>
          </h4>
          <p>Tổng giá: {formatVND(bill.total_price)}</p>
          <p>VAT (5%): {formatVND(bill.vat)}</p>
          <p>Phí vận chuyển: {formatVND(bill.shipping_fee)}</p>
          <p style={{ fontWeight: "bold", color: "#c0392b", textAlign: "right" }}>
            Thành tiền: {formatVND(bill.final_total)}
          </p>
        </div>

        <div style={{ textAlign: "center", marginTop: 30 }}>
          <button
            onClick={() => {
              localStorage.removeItem("invoice");
              localStorage.removeItem("cart");
              Cookies.set("cart_count", "0");
              dispatch(setCount(0));
              router.push("/shop").then(() => window.location.reload());
            }}
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
