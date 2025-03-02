import React, { useState, useEffect } from "react";
import HeaderComponent from './HeaderComponent';
import '@/styles/shop.css'
import { useRouter } from "next/router";

interface Props {
  onBack: (product: any) => void
}
export const Cart: React.FC<Props> = ({onBack}) => {
  const router = useRouter();
  const [openModel, setOpenModel] = useState(false)
  const [selectAuth, setSelectAuth] = useState(true)
  function openModelHandler(element:boolean) {
      if (!openModel) {
          setSelectAuth(element)
          setOpenModel(true)
      } else {
          setOpenModel(false)
      }
  }

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Sữa rửa mặt dành cho da dầu mụn",
      price: 380000,
      quantity: 3,
      image: "./image/svr.jfif",
    },
    {
      id: 2,
      name: "Sữa rửa mặt dòng dược mỹ phẩm, chuyên da nỗi lo về mụn",
      price: 420000,
      quantity: 1,
      image: "./image/biodema.jfif",
    },
  ]);

  const [formattedPrices, setFormattedPrices] = useState({});

  useEffect(() => {
    const updatedPrices = {};
    cartItems.forEach(item => {
      updatedPrices[item.id] = (item.price * item.quantity).toLocaleString('vi-VN');
    });
    setFormattedPrices(updatedPrices);
  }, [cartItems]);

  const updateQuantity = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vat = totalPrice * 0.05;
  const shippingFee = 200000;
  const finalTotal = totalPrice + vat + shippingFee;

  return (
    <>
     <div className="cart-container container">
      <h2 className="cart-header">Giỏ hàng</h2>
      <table className="cart-table">
        <thead>
          <tr className="cart-table-header">
            <th className="cart-table-cell">Hình ảnh</th>
            <th className="cart-table-cell">Sản phẩm</th>
            <th className="cart-table-cell">Giá</th>
            <th className="cart-table-cell">Số lượng</th>
            <th className="cart-table-cell">Tổng</th>
            <th className="cart-table-cell">Xóa</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id}>
              <td className="cart-table-cell">
                <img src={item.image} alt={item.name} className="product-image" />
              </td>
              <td className="cart-table-cell">{item.name}</td>
              <td className="cart-table-cell">{item.price.toLocaleString("vi-VN")}₫</td>
              <td className="cart-table-cell quantity-cell">
                <div className="quantity-cell-border">
                <span onClick={() => updateQuantity(item.id, -1)} className="quantity-btn btn-one ">-</span>
                <span className="quantity">{item.quantity}</span>
                <span onClick={() => updateQuantity(item.id, 1)} className="quantity-btn btn-two">+</span>
                </div>
              </td>
              <td className="cart-table-cell">{formattedPrices[item.id] || "..."}₫</td>
              <td className="cart-table-cell">
                <div onClick={() => removeItem(item.id)}><i className="delete-btn fa-solid fa-trash"></i></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="cart-summary">
        <p>Tổng giá: {totalPrice.toLocaleString("vi-VN")}₫</p>
        <p>VAT (5%): {vat.toLocaleString("vi-VN")}₫</p>
        <p>Shipping: {shippingFee.toLocaleString("vi-VN")}₫</p>
        <p className="font-bold">Thành tiền: {finalTotal.toLocaleString("vi-VN")}₫</p>
      </div>
      <div className="footer-button">
        <button className="checkout-btn">Thanh Toán</button>
      </div>
      
    </div>
    </>
  );
}
export default Cart
