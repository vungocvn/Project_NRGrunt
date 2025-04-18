import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setCount } from "@/store/slices/productsSlice";
import "@/styles/invoice.css";
import HeaderComponent from "@/components/HeaderComponent";

export default function InvoicePage() {
    const [bill, setBill] = useState<any | null>(null);
    const router = useRouter();
    const dispatch = useDispatch();
    const { id } = router.query;

    const getOrderDetails = async (orderId: number) => {
        const res = await axios.get(`http://127.0.0.1:8000/api/detail-orders/?order_id=${orderId}`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token_portal")}`,
            },
        });
        return res.data.data;
    };

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const token = Cookies.get("token_portal");
                const orderRes = await axios.get(`http://127.0.0.1:8000/api/orders/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const invoice = orderRes.data.data;
                const details = await getOrderDetails(invoice.id);

                setBill({
                    ...invoice,
                    vat: invoice.vat,
                    shipping_fee: invoice.shipping_fee,
                    final_total: invoice.final_total,
                    details,
                    customer_info: {
                        name: invoice.receiver_name || invoice.user?.name || "Không rõ",
                        phone: invoice.receiver_phone || invoice.user?.phone || "Không rõ",
                        address: invoice.receiver_address || invoice.user?.address || "Không rõ",
                    }
                });

            } catch (error) {
                console.error("Lỗi khi lấy hóa đơn:", error);
            }
        };

        fetchData();
    }, [id]);

    const formatVND = (amount: any) => {
        if (!amount || isNaN(amount)) return "0 ₫";
        return parseFloat(amount).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
        });
    };

    if (!bill) return <p>Đang tải hóa đơn...</p>;

    return (
        <div className="container">
            <HeaderComponent />
            <div className="invoice" style={{ padding: "30px", maxWidth: "800px", margin: "120px auto" }}>
                <h2 style={{ textAlign: "center", color: "#01ab78" }}>HÓA ĐƠN THANH TOÁN</h2>

                <div className="customer-info" style={{ marginBottom: "20px" }}>
                    <p><strong>Tên khách hàng:</strong> {bill.customer_info.name}</p>
                    <p><strong>SĐT:</strong> {bill.customer_info.phone}</p>
                    <p><strong>Địa chỉ:</strong> {bill.customer_info.address}</p>
                </div>

                {bill.details?.map((item: any) => (
                    <div key={item.id} className="product-row">
                        <div style={{ display: "flex" }}>
                            <img src={`http://127.0.0.1:8000${item.image}`} className="product-image" />
                            <div className="product-info">
                                <p style={{ margin: 0, fontWeight: "bold" }}>{item.product_name}</p>
                                <p style={{ margin: 0 }}>Số lượng: {item.quantity}</p>
                            </div>
                        </div>
                        <div className="product-price">
                            <p>Giá: {formatVND(item.unit_price)}</p>
                            <p>Tổng: {formatVND(item.unit_price * item.quantity)}</p>
                        </div>
                    </div>
                ))}

                <div className="invoice-summary">
                    <h4>Đơn hàng #{bill.id} – <span style={{ color: "#999" }}>{bill.order_code}</span></h4>
                    <p>Tổng giá: {formatVND(bill.total_price)}</p>
                    <p>VAT (5%): {formatVND(bill.vat)}</p>
                    <p>Phí vận chuyển: {formatVND(bill.shipping_fee)}</p>
                    <p style={{ fontWeight: "bold", color: "#c0392b" }}>
                        Thành tiền: {formatVND(bill.final_total)}
                    </p>
                </div>

                <div style={{ textAlign: "center", marginTop: 30 }}>
                    <button
                        onClick={() => {
                            if (window.history.length > 2) {
                                router.back(); // quay lại trang lịch sử
                            } else {
                                router.push("/his");
                            }
                        }}
                        style={{
                            padding: "10px 20px", backgroundColor: "#ccc", color: "#000",
                            border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "10px"
                        }}
                    >
                        Quay lại lịch sử
                    </button>

                    <button
                        onClick={() => {
                            localStorage.removeItem("cart");
                            Cookies.set("cart_count", "0");
                            dispatch(setCount(0));
                            router.push("/shop").then(() => window.location.reload());
                        }}
                        style={{
                            padding: "10px 20px", backgroundColor: "#01ab78", color: "white",
                            border: "none", borderRadius: "4px", cursor: "pointer"
                        }}
                    >
                        Tiếp tục mua sắm
                    </button>
                </div>
            </div>
        </div>
    );
}
