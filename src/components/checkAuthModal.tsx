import { useState } from 'react';
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

  const handleSubmit = async () => {
    if (!name || !phone || !address) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);

    try {
      // ✅ Gửi cả name lên API
      await axios.put("http://127.0.0.1:8000/api/users/profile", {
        name,
        phone,
        address,
      }, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token_portal")}`
        }
      });

      // ✅ Gửi cả name cho quá trình đặt hàng
      onSubmit({ name, phone, address });
    } catch (err) {
      console.error("Lỗi cập nhật thông tin:", err);
      alert("Không thể cập nhật thông tin người dùng");
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
