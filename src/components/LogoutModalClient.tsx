import React, { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModalClient = ({ open, onClose, onConfirm }: Props) => {
  const [logoutMessage, setLogoutMessage] = useState<string | null>(null);

  // Hàm đóng modal khi nhấn ra ngoài modal
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Xử lý khi nhấn nút "Đăng xuất"
  const handleConfirm = () => {
    onConfirm(); // Gọi hàm onConfirm từ props (thực hiện hành động đăng xuất)
    setLogoutMessage("Đã đăng xuất thành công!"); // Cập nhật thông báo đăng xuất
    setTimeout(() => {
      setLogoutMessage(null); // Đóng thông báo sau 3 giây
    }, 3000);
  };

  if (!open) return null;

  return (
    <div className="logout-overlay" onClick={handleOverlayClick}>
      <div className="logout-modal">
        <h3 className="logout-title">Đăng xuất</h3>
        <p className="logout-message">Bạn chắc chắn muốn rời khỏi tài khoản?</p>
        <div className="logout-actions">
          <button className="btn-cancel" onClick={onClose}>Hủy</button>
          <button className="btn-confirm" onClick={handleConfirm}>Đăng xuất</button>
        </div>
      </div>
      {logoutMessage && <div className="logout-status-message">{logoutMessage}</div>}
    </div>
  );
};

export default LogoutModalClient;
