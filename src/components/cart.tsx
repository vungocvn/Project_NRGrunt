import React, { useState, useEffect } from "react";
import HeaderComponent from './HeaderComponent';
import '@/styles/shop.css'
import { useRouter } from "next/router";
import axios from "axios";
import { get } from "http";
import Cookies from "js-cookie";

interface Props {
  onBack: (product: any) => void
}
interface CartItem {
  id:number,
  image: string,
  price: string,
  product_id: number,
  product_name: string
  quantity: number
  user_id: number
}
export const Cart: React.FC<Props> = ({ onBack }) => {
  const router = useRouter();
  const [openModel, setOpenModel] = useState(false)
  const [selectAuth, setSelectAuth] = useState(true)
  function openModelHandler(element: boolean) {
    if (!openModel) {
      setSelectAuth(element)
      setOpenModel(true)
    } else {
      setOpenModel(false)
    }
  }
  function handleOrder() {
    axios.post(`http://127.0.0.1:8000/api/orders`, {
      cart_ids:cartItems.map((item) => item.id),
    }, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token_cua_Ngoc')}`
      }
    })
      .then(res => {
        console.log(res.data);
        if (res.data.status === 200 || res.data.status === 201) {
          alert("Order success");
        } else {
          alert("Order fail");
        }
      })
      .catch(error => console.log(error))
    }
 
  function updateCart(cart_id:number,product_id: number, quantity: number) {
    axios.put(`http://127.0.0.1:8000/api/carts/${cart_id}`, { product_id: product_id, quantity: quantity }
      , {
        headers: {
          Authorization: `Bearer ${Cookies.get('token_cua_Ngoc')}`
        }
      }
    )
      .then(res => {
        console.log(res.data);
        if (res.data.status === 200) {
          // alert("Cap nhap gio hang thanh cong");
        } else {
          alert("Cap nhap gio hang that bai");
        }
      })
      .catch(error => console.log(error))
  }
  function deleteCart(cart_id:number) {
    axios.delete(`http://127.0.0.1:8000/api/carts/${cart_id}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('token_cua_Ngoc')}`
        }
      }
    )
      .then(res => {
        if (res.data.status === 204 || res.data.status === 404 || res.data.status === 200 || res.data.status == undefined) {
          getCart();
          alert("Delete cart success");
        } else {
          alert("Xoa gio hang that bai");
        }
      })
      .catch(error => console.log(error))
    }

  const [cartItems, setCartItems] = useState<CartItem[]>([
  ]);
  function getCart() {
    const token = Cookies.get('token_cua_Ngoc') || "";
    axios.get(`http://127.0.0.1:8000/api/carts`,
      {
        params: { page: 1, page_size: 100 },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => {
        if (res.data.status === 200) {
          setCartItems(res.data.data)
        }
        console.log(res.data.data)
      })
      .catch((error) => {
        console.log(error);
      })

  };
  useEffect(() => {
    const updatedPrices = {};
    getCart();
    // cartItems.forEach(item => {
    //   updatedPrices[item.id] = (item.price * item.quantity).toLocaleString('vi-VN');
    // });
    // setFormattedPrices(updatedPrices);
  }, []);


  const updateQuantity = (id: number, delta:any,quantity:any,idProduct:any) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
    updateCart(id,idProduct,Math.max(1, quantity + delta));
  };
  console.log(cartItems)

  const removeItem = (id:number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const vat = totalPrice * 0.02;
  const shippingFee = 50000;
  const finalTotal = totalPrice + vat + shippingFee;
  function formatVND(amount:any) {
    return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}
  return (
    <>
      <div className="cart-container container-one">
        <h2 className="cart-header">Giỏ hàng <i className="cart-header-icon-nav fa-solid fa-bag-shopping"></i></h2>
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
                  <img src={item.image} alt={item.product_name} className="product-image" />
                </td>
                <td className="cart-table-cell">{item.product_name}</td>
                <td className="cart-table-cell">{formatVND(parseFloat(item.price))}</td>
                <td className="cart-table-cell quantity-cell">
                  <div className="quantity-cell-border">
                    <span onClick={() => updateQuantity(item.id, -1,item.quantity,item.product_id)} className="quantity-btn btn-one ">-</span>
                    <span className="quantity">{item.quantity}</span>
                    <span onClick={() => updateQuantity(item.id, 1,item.quantity,item.product_id)} className="quantity-btn btn-two">+</span>
                  </div>
                </td>
                <td className="cart-table-cell">{formatVND(parseFloat(item.price)*item.quantity)|| "..."}</td>
                <td className="cart-table-cell">
                  <div onClick={() => deleteCart(item.id)}><i className="delete-btn fa-solid fa-trash"></i></div>
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
          <button className="checkout-btn" onClick={handleOrder}>Thanh Toán</button>
        </div>

      </div>
    </>
  );
}
export default Cart
