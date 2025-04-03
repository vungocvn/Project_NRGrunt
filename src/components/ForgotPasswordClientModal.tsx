import { useState } from "react";
import axios from "axios";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  openLoginModal: () => void;
}
export default function ForgotPasswordModal({ isOpen, onClose,openLoginModal }: ForgotPasswordModalProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function handleSendOTP() {
    if (!email) return alert("Vui lòng nhập email!");
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/client/forgot-password", { email });
      if (res.data.status === 200) {
        alert(res.data.message || "Đã gửi OTP đến email!");
        setStep(2);
      } else {
        alert(res.data.message || "Không thể gửi OTP!");
      }
    } catch {
      alert("Có lỗi khi gửi OTP, vui lòng thử lại!");
    }
  }

  async function handleResetPassword() {
    if (!otp || !newPassword) return alert("Vui lòng nhập OTP và mật khẩu mới!");
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/client/reset-password", {
        email,
        otp,
        new_password: newPassword,
      });
      if (res.data.status === 200) {
        alert(res.data.message || "Đổi mật khẩu thành công!");
        handleCloseAll();
        setTimeout(() => {
          openLoginModal();
        }, 300);
      }
       else {
        alert(res.data.message || "Đổi mật khẩu thất bại!");
      }
    } catch {
      alert("Có lỗi khi đổi mật khẩu, vui lòng thử lại!");
    }
  }

  function handleCloseAll() {
    setStep(1);
    setEmail("");
    setOtp("");
    setNewPassword("");
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="forgot-modal-overlay">
      <div className="forgot-modal-container">
        <button className="forgot-modal-close" onClick={handleCloseAll}>×</button>
        <h2 className="forgot-modal-title">Quên mật khẩu</h2>

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="forgot-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="forgot-modal-buttons">
              <button className="btn-primary" onClick={handleSendOTP}>Gửi OTP</button>
              <button className="btn-secondary" onClick={handleCloseAll}>Hủy</button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Nhập mã OTP"
              className="forgot-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              type="password"
              placeholder="Nhập mật khẩu mới"
              className="forgot-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className="forgot-modal-buttons">
              <button className="btn-primary" onClick={handleResetPassword}>Đổi mật khẩu</button>
              <button className="btn-secondary" onClick={handleCloseAll}>Hủy</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
