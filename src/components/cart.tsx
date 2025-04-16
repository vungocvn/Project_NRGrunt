import React, { useState, useEffect } from "react";
import HeaderComponent from "./HeaderComponent";
import "@/styles/shop.css";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { setCount } from "@/store/slices/productsSlice";
import CheckoutModal from "@/components/checkAuthModal";

interface Props {
  onBack: (product: any) => void;
  setNotify?: (msg: string) => void;
}

interface CartItem {
  id: number;
  image: string;
  price: string;
  product_id: number;
  product_name: string;
  quantity: number;
  user_id: number;
}

export const Cart: React.FC<Props> = ({ onBack, setNotify }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingFee, setShippingFee] = useState(30000);
  const [vat, setVat] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const { token } = useSelector((state: any) => ({
    token: state.auth.token
  }));

  const totalPrice = selectedItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

  useEffect(() => {
    const vatAmount = totalPrice * 0.05;
    setVat(vatAmount);
    setFinalTotal(totalPrice + vatAmount + shippingFee);
  }, [totalPrice, shippingFee]);

  const getCart = () => {
    const token = Cookies.get("token_portal") || "";
    axios
      .get(`http://127.0.0.1:8000/api/carts`, {
        params: { page: 1, page_size: 100 },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        if (res.data.status === 200) {
          setCartItems(res.data.data);
          dispatch(setCount(res.data.data.length));
        }
      })
      .catch((error) => console.log(error));
  };

  const updateCart = (cart_id: number, product_id: number, quantity: number) => {
    axios
      .put(
        `http://127.0.0.1:8000/api/carts/${cart_id}`,
        { product_id, quantity },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token_portal")}`
          }
        }
      )
      .catch((error) => console.log(error));
  };

  const updateQuantity = (id: number, delta: number, quantity: number, product_id: number) => {
    const newQty = Math.max(1, quantity + delta);
    setCartItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity: newQty } : item)));
    updateCart(id, product_id, newQty);
  };

  const deleteCart = (id: number) => {
    axios
      .delete(`http://127.0.0.1:8000/api/carts/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token_portal")}`
        }
      })
      .then((res) => {
        if ([200, 204, 404].includes(res.data.status) || res.data.status === undefined) {
          getCart();
          alert("Delete cart success");
        } else {
          alert("Xóa giỏ hàng thất bại");
        }
      })
      .catch((error) => console.log(error));
  };

  const handleOrder = async (name: string, phone: string, address: string) => {
    try {
      const token = Cookies.get("token_portal");
  
      await axios.put(
        "http://127.0.0.1:8000/api/users/profile",
        { name, phone, address, email: null, role: null },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      const payload = {
        cart_ids: selectedItems.map((item) => item.id),
        total_price: totalPrice,
        vat: vat,
        shipping_fee: shippingFee,
        final_total: finalTotal,
        name,    
        phone,
        address
      };
      
  
      const res = await axios.post(`http://127.0.0.1:8000/api/orders`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (res.data.status === 200 || res.data.status === 201) {
        const orderData = {
          ...res.data.data,
          customer_info: {
            name,
            phone,
            address
          }
        };
  
        router.push(`/invoice/${orderData.id}`);
      } else {
        alert("Đặt hàng thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      alert("Có lỗi xảy ra khi đặt hàng!");
    }
  };
  

  useEffect(() => {
    getCart();
  }, []);

  const formatVND = (amount: number) => {
    return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  const handleCheckoutClick = () => {
    if (!token) {
      setNotify?.("Please select product to order");
      return;
    }
    if (selectedItems.length === 0) {
      alert("Please select product to order!");
      return;
    }
    setShowModal(true);
  };

  const handleSelectItem = (item: CartItem, isSelected: boolean) => {
    if (isSelected) {
      setSelectedItems((prev) => [...prev, item]);
    } else {
      setSelectedItems((prev) => prev.filter((i) => i.id !== item.id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedItems(cartItems);
    } else {
      setSelectedItems([]);
    }
  };

  return (
    <>
      <div className="cart-container container-one">
        <h2 className="cart-header">
          Giỏ hàng <i className="cart-header-icon-nav fa-solid fa-bag-shopping"></i>
        </h2>

        <table className="cart-table">
          <thead>
            <tr className="cart-table-header">
              <th className="cart-table-cell">Chọn</th>
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
                <td className="cart-table-cell" style={{ width: "10px", paddingLeft: 20 }}>
                  <CheckboxSimple
                    onSelectItem={(val) => handleSelectItem(item, val)}
                    isChecked={selectedItems.some((i) => i.id === item.id)}
                  />
                </td>
                <td className="cart-table-cell">
                  <img src={`http://127.0.0.1:8000${item.image}`} alt={item.product_name} className="product-image" />
                </td>
                <td className="cart-table-cell">{item.product_name}</td>
                <td className="cart-table-cell">{formatVND(parseFloat(item.price))}</td>
                <td className="cart-table-cell quantity-cell">
                  <div className="quantity-cell-border">
                    <span onClick={() => updateQuantity(item.id, -1, item.quantity, item.product_id)} className="quantity-btn btn-one">-</span>
                    <span className="quantity">{item.quantity}</span>
                    <span onClick={() => updateQuantity(item.id, 1, item.quantity, item.product_id)} className="quantity-btn btn-two">+</span>
                  </div>
                </td>
                <td className="cart-table-cell">{formatVND(parseFloat(item.price) * item.quantity)}</td>
                <td className="cart-table-cell">
                  <div onClick={() => deleteCart(item.id)}>
                    <i className="delete-btn fa-solid fa-trash"></i>
                  </div>
                </td>
              </tr>
            ))}
            <tr>
            <td className="cart-table-cell" colSpan={7} style={{ textAlign: "left", padding: "12px 20px" }}>
  <label className="flex items-center gap-2 font-medium cursor-pointer">
    <CheckboxSimple isChecked={selectAll} onSelectItem={handleSelectAll} />
    Chọn tất cả sản phẩm
  </label>
</td>

            </tr>
          </tbody>
        </table>

        <div className="cart-summary">
          <p>Tổng giá: {formatVND(totalPrice)}</p>
          <p>VAT (5%): {formatVND(vat)}</p>
          <p>Phí vận chuyển: {formatVND(shippingFee)}</p>
          <p className="font-bold">Thành tiền: {formatVND(finalTotal)}</p>
        </div>

        <div className="footer-button">
          <button className="checkout-btn" onClick={handleCheckoutClick}>
            Đặt hàng
          </button>
        </div>
      </div>

      {showModal && (
        <CheckoutModal
          onClose={() => setShowModal(false)}
          onSubmit={({ name, phone, address }) => {
            handleOrder(name, phone, address).then(() => setShowModal(false));
          }}
        />
      )}
    </>
  );
};

export default Cart;

const CheckboxSimple = ({ onSelectItem, isChecked = false }: { onSelectItem?: (val: boolean) => void; isChecked?: boolean }) => {
  const [checked, setChecked] = useState(isChecked);

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          setChecked(e.target.checked);
          if (onSelectItem) onSelectItem(e.target.checked);
        }}
        className="w-5 h-5 accent-blue-600"
      />
    </label>
  );
};
