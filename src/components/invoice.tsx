import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
export default function Invoice() {
    const [bill,setBill] = useState([]);
    function getOderById(id:any) {
      axios.get(`http://127.0.0.1:8000/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token_cua_Ngoc')}`
        }
      })
      .then(res => {
        console.log(res.data);
      })
    }
    function getAllOrder() {
        axios.get(`http://127.0.0.1:8000/api/orders`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('token_cua_Ngoc')}`
          }
        })
          .then(res => {
            console.log(res.data);
            if (res.data.status === 200 || res.data.status === 201) {
                setBill(res.data.data);
                getOderById(res.data.data[0].id)
            } else {
                alert("Lấy danh sách thất bại");
            }
          })
          .catch(error => console.log(error))
        }
        function formatVND(amount:any) {
            return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
        }
        const totalPrice = bill.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
        const vat = totalPrice * 0.01;
        const shippingFee = 50000;
        const finalTotal = totalPrice + vat + shippingFee;
         useEffect(() => {
            const updatedPrices = {};
            getAllOrder();
          }, []);
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
              <tr key={item.id}>
                <td className="cart-table-cell">
                  <img src={item.image} alt={item.product_name} className="product-image" />
                </td>
                <td className="cart-table-cell">{item.product_name}</td>
                <td className="cart-table-cell">{formatVND(parseFloat(item.price))}</td>
                <td className="cart-table-cell">{item.quantity}</td>
                <td className="cart-table-cell">{formatVND(parseFloat(item.price)*item.quantity)|| "..."}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="total">Tổng tiền: {totalPrice.toLocaleString("vi-VN")}₫</p>
          <p className="total">VAT (5%): {vat.toLocaleString("vi-VN")}₫</p>
          <p className="total">Shipping: {shippingFee.toLocaleString("vi-VN")}₫</p>
          <p className="total">Thành tiền: {finalTotal.toLocaleString("vi-VN")}₫</p>
    </div>
        </div>
    );
}