import { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import axios from "axios";

type Props = {
  onClose: () => void;
  onSubmit: (data: { name: string; phone: string; address: string }) => void;
};

export default function CheckoutModal({ onClose, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Tự động lấy thông tin user nếu đã login
  useEffect(() => {
    const token = Cookies.get("token_portal");
    if (token) {
      axios.get("http://127.0.0.1:8000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const data = res.data.data;
        setName(data.name || '');
        setPhone(data.phone || '');
        setAddress(data.address || '');
      })
      .catch(() => {
        console.warn("Không lấy được thông tin người dùng");
      });
    }
  }, []);
  

  const handleSubmit = async () => {
    console.log("token_portal", Cookies.get("token_portal"));
    if (!name || !phone || !address) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const token = Cookies.get("token_portal");
    if (!token) {
      alert("Vui lòng đăng nhập để tiếp tục đặt hàng.");
      onClose(); // hoặc mở modal login
      return;
    }

    setLoading(true);

    try {
      await axios.put("http://127.0.0.1:8000/api/users/profile", {
        name,
        phone,
        address,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      onSubmit({ name, phone, address });
    } catch (err) {
      console.error("Lỗi cập nhật thông tin:", err);
      alert("Không thể cập nhật thông tin người dùng. Vui lòng đăng nhập lại.");
    }

    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Thông tin đặt hàng</h2>

        <div className="modal-field">
          <label>Tên khách hàng</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="modal-input"
          />
        </div>

        <div className="modal-field">
          <label>Số điện thoại</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="modal-input"
          />
        </div>

        <div className="modal-field">
          <label>Địa chỉ</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="modal-input"
          />
        </div>

        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={onClose}>Huỷ</button>
          <button className="modal-btn confirm" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Đang gửi...' : 'Xác nhận'}
          </button>
        </div>
      </div>
    </div>
  );
}
