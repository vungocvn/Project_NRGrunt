import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function Invoice() {
  const [bill, setBill] = useState<any[]>([]);

  async function getOrderDetailsByOrderId(id: number) {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/detail-orders/?order_id=${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token_portal")}`
        }
      });

      if (res.data.status === 200 || res.data.status === 201) {
        return res.data.data; // Trả về dữ liệu chi tiết đơn hàng
      }
      return [];
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      return [];
    }
  }

  async function getAllOrder() {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/orders", {
        headers: {
          Authorization: `Bearer ${Cookies.get("token_portal")}`
        }
      });

      if (res.data.status === 200 || res.data.status === 201) {
        const orders = res.data.data || [];

        const ordersWithDetails = await Promise.all(
          orders.map(async (order: any) => {
            const orderDetails = await getOrderDetailsByOrderId(order.id);
            return { ...order, details: orderDetails };
          })
        );

        setBill(ordersWithDetails);
        console.log("Danh sách hóa đơn:", ordersWithDetails);
      } else {
        alert("Lấy danh sách hóa đơn thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách hóa đơn:", error);
    }
  }

  useEffect(() => {
    getAllOrder();
  }, []);

  function formatVND(amount: any) {
    return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  }

  const totalPrice = bill?.reduce((sum: number, order: any) => sum + order.total_price, 0) || 0;
  const vat = totalPrice - totalPrice* 0.95;
  const shippingFee = 50000;
  const finalTotal = totalPrice + vat + shippingFee;

  return (
    <div>
      <div id="invoice" className="invoice">
        <h2>HÓA ĐƠN THANH TOÁN</h2>
        <table>
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Tổng tiền</th>
            </tr>
          </thead>
          <tbody>
            {bill.map((item) => (
              item.details.map((detail: any) => (
                <tr key={detail.id}>
                  <td className="cart-table-cell">
                    <img src={detail.image} alt={detail.product_name} className="product-image" />
                  </td>
                  <td className="cart-table-cell">{detail.product_name}</td>
                  <td className="cart-table-cell">{formatVND(parseFloat(detail.price))}</td>
                  <td className="cart-table-cell">{detail.quantity}</td>
                  <td className="cart-table-cell">{formatVND(parseFloat(detail.price) * detail.quantity) || "..."}</td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
        <p className="total">Tổng tiền: {formatVND(totalPrice)}</p>
        <p className="total">VAT (5%): {formatVND(vat)}</p>
        <p className="total">Phí vận chuyển: {formatVND(shippingFee)}</p>
        <p className="total">Thành tiền: {formatVND(finalTotal)}</p>
      </div>
    </div>
  );
}
