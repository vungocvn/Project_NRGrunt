import React from "react";
interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModalClient = ({ open, onClose, onConfirm }: Props) => {
  if (!open) return null;

  return (
    <div className="logout-overlay">
      <div className="logout-modal">
        <h3 className="logout-title">Đăng xuất</h3>
        <p className="logout-message">Bạn chắc chắn muốn rời khỏi tài khoản?</p>
        <div className="logout-actions">
          <button className="btn-cancel" onClick={onClose}>Hủy</button>
          <button className="btn-confirm" onClick={onConfirm}>Đăng xuất</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModalClient;
