import React, { useState, useEffect } from "react";
import "@/styles/shop.css";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { setCount } from "@/store/slices/productsSlice";
import CheckoutModal from "@/components/checkAuthModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const { token, isLogin } = useSelector((state: any) => ({
    token: state.auth.token,
    isLogin: state.auth.isLogin,
  }));

  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  useEffect(() => {
    const vatAmount = totalPrice * 0.05;
    setVat(vatAmount);
    setFinalTotal(totalPrice + vatAmount + shippingFee);
  }, [totalPrice, shippingFee]);

  useEffect(() => {
    getCart();
  }, []);

  const getCart = () => {
    setIsLoadingCart(true);
    const token = Cookies.get("token_portal");

    if (!token) {
      setCartItems([]);
      setIsLoadingCart(false);
      return;
    }

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
      .catch((error) => console.log(error))
      .finally(() => setIsLoadingCart(false));
  };



  const updateCart = (cart_id: number, product_id: number, quantity: number) => {
    axios
      .put(
        `http://127.0.0.1:8000/api/carts/${cart_id}`,
        { product_id, quantity },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token_portal")}`,
          },
        }
      )
      .catch((error) => console.log(error));
  };

  const updateQuantity = (
    id: number,
    delta: number,
    quantity: number,
    product_id: number
  ) => {
    const newQty = Math.max(1, quantity + delta);
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
    updateCart(id, product_id, newQty);
  };

  const deleteCart = (id: number) => {
    axios
      .delete(`http://127.0.0.1:8000/api/carts/${id}`, {
        headers: { Authorization: `Bearer ${Cookies.get("token_portal")}` },
      })
      .then((res) => {
        if ([200, 204, 404].includes(res.data.status) || res.data.status === undefined) {
          getCart();
          toast.success("Xoá sản phẩm thành công");
        } else {
          toast.error("Xoá sản phẩm thất bại");
        }
      })
      .catch(() => toast.error("Xoá sản phẩm thất bại"));
  };

  const handleOrder = async (name: string, phone: string, address: string) => {
    try {
      const token = Cookies.get("token_portal");
      const payload = {
        cart_ids: selectedItems.map((item) => item.id),
        total_price: totalPrice,
        vat,
        shipping_fee: shippingFee,
        final_total: finalTotal,
        receiver_name: name,
        receiver_phone: phone,
        receiver_address: address,
      };

      const res = await axios.post("http://127.0.0.1:8000/api/orders", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if ([200, 201].includes(res.data.status)) {
        localStorage.removeItem("cart");
        Cookies.set("cart_count", "0");
        dispatch(setCount(0));
        router.push(`/invoice/${res.data.data.id}`);
      } else {
        alert("Đặt hàng thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      alert("Có lỗi xảy ra khi đặt hàng!");
    }
  };

  const handleCheckoutClick = () => {
    if (!token) {
      toast.warning("Bạn cần đăng nhập để đặt hàng!");
      return;
    }
    if (selectedItems.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một sản phẩm để đặt hàng!");
      return;
    }
    setShowModal(true);
  };


  const handleSelectItem = (item: CartItem, isSelected: boolean) => {
    if (isSelected) setSelectedItems((prev) => [...prev, item]);
    else setSelectedItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedItems(checked ? cartItems : []);
  };

  function formatVND(amount: any) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }

  return (
    <>
      <div className="cart-container container-one">
        {isLoadingCart ? (
          <p style={{ textAlign: 'center' }}>Đang tải giỏ hàng...</p>
        ) : cartItems.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
            <img src="http://127.0.0.1:8000/storage/images/cart.png" alt="empty cart" style={{ width: '360px', height: '300px', marginBottom: '16px' }} />
            <p style={{ fontSize: '16px', marginBottom: '4px', color: '#333' }}>Giỏ hàng của bạn đang trống.</p>
            <p style={{ fontSize: '14px', marginBottom: '20px', color: '#666' }}>Hãy chọn thêm sản phẩm để mua sắm nhé</p>
            <button
              style={{
                padding: '10px 24px',
                backgroundColor: '#01ab78',
                border: 'none',
                color: 'white',
                borderRadius: '24px',
                fontSize: '15px',
                cursor: 'pointer'
              }}
              onClick={() => window.location.href = '/shop'}
            >
              Mua sắm ngay
            </button>
          </div>
        ) : (
          <>
            <table className="cart-table">
              <thead>
                <tr className="cart-table-header">
                  <th>Chọn</th>
                  <th>Hình ảnh</th>
                  <th>Sản phẩm</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Tổng</th>
                  <th>Xóa</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td><CheckboxSimple isChecked={selectedItems.some((i) => i.id === item.id)} onSelectItem={(val) => handleSelectItem(item, val)} /></td>
                    <td><img src={`http://127.0.0.1:8000${item.image}`} alt={item.product_name} className="product-image" /></td>
                    <td>{item.product_name}</td>
                    <td>{formatVND(parseFloat(item.price))}</td>
                    <td>
                      <div className="quantity-cell-border">
                        <span onClick={() => updateQuantity(item.id, -1, item.quantity, item.product_id)} className="quantity-btn btn-one">-</span>
                        <span className="quantity">{item.quantity}</span>
                        <span onClick={() => updateQuantity(item.id, 1, item.quantity, item.product_id)} className="quantity-btn btn-two">+</span>
                      </div>
                    </td>
                    <td>{formatVND(parseFloat(item.price) * item.quantity)}</td>
                    <td><i className="delete-btn fa-solid fa-trash" onClick={() => setConfirmDeleteId(item.id)}></i></td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={7} className="text-left">
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
              <button className="checkout-btn" onClick={handleCheckoutClick}>Đặt hàng</button>
            </div>

            {showModal && (
              <CheckoutModal
                onClose={() => setShowModal(false)}
                onSubmit={({ name, phone, address }) => handleOrder(name, phone, address).then(() => setShowModal(false))}
              />
            )}
          </>
        )}

        {confirmDeleteId !== null && (
          <div className="delete-confirm-overlay">
            <div className="delete-confirm-modal">
              <h3>Xác nhận xoá</h3>
              <p>Bạn có chắc chắn muốn xoá sản phẩm này khỏi giỏ hàng?</p>
              <div className="delete-confirm-buttons">
                <button className="cancel-btn" onClick={() => setConfirmDeleteId(null)}>Hủy</button>
                <button className="delete-btn" onClick={() => { deleteCart(confirmDeleteId!); setConfirmDeleteId(null); }}>Xoá</button>
              </div>
            </div>
          </div>
        )}
        {confirmDeleteId !== null && (
          <div className="delete-confirm-overlay">
            <div className="delete-confirm-modal">
              <h3>Xác nhận xoá</h3>
              <p>Bạn có chắc chắn muốn xoá sản phẩm này khỏi giỏ hàng?</p>
              <div className="delete-confirm-buttons">
                <button className="cancel-btn" onClick={() => setConfirmDeleteId(null)}>Hủy</button>
                <button className="delete-btn" onClick={() => { deleteCart(confirmDeleteId!); setConfirmDeleteId(null); }}>Xoá</button>
              </div>
            </div>
          </div>
        )}
      </div>
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
          onSelectItem?.(e.target.checked);
        }}
        className="w-5 h-5 accent-blue-600"
      />
    </label>
  );
};
