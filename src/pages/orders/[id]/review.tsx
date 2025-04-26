import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "@/styles/review.css";
import HeaderComponent from "@/components/HeaderComponent";

export default function ReviewOrderPage() {
  const router = useRouter();
  const { id } = router.query;
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState<Record<number, { rating: number; comment: string }>>({});

  const token = Cookies.get("token_portal");

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data && res.data.products) {
          setProducts(res.data.products);
        }
      } catch (err) {
        toast.error("Không thể tải đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleReview = async (product_id: number) => {
    const { rating, comment } = reviewData[product_id] || { rating: 5, comment: "" };
    try {
      await axios.post(
        "http://localhost:8000/api/reviews",
        {
          product_id,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Đánh giá thành công");
      setProducts((prev) =>
        prev.map((p) =>
          p.product_id === product_id ? { ...p, is_reviewed: true } : p
        )
      );
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gửi đánh giá thất bại");
    }
  };

  const formatVND = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  if (loading) return <p>Đang tải sản phẩm...</p>;

  return (
    <div className="container">
      <HeaderComponent />
      <div className="review-wrapper">
        <h2>Đánh giá đơn hàng #{id}</h2>
        {products.length === 0 ? (
          <p>Không có sản phẩm trong đơn hàng.</p>
        ) : (
          <>
            {products.map((prod) => (
              <div key={prod.product_id} className="review-item">
                <img
                  src={`http://localhost:8000${prod.image}`}
                  alt={prod.product_name}
                  className="review-image"
                />
                <div className="review-info">
                  <h4>{prod.product_name}</h4>
                  <p>Giá: {formatVND(prod.unit_price)}</p>
                  {prod.is_reviewed ? (
                    <p style={{ color: "green" }}>Đã đánh giá</p>
                  ) : (
                    <div>
                      <div className="review-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            style={{
                              color:
                                star <= (reviewData[prod.product_id]?.rating || 0)
                                  ? "#ffc107"
                                  : "#ddd",
                            }}
                            onClick={() =>
                              setReviewData((prev) => ({
                                ...prev,
                                [prod.product_id]: {
                                  ...prev[prod.product_id],
                                  rating: star,
                                  comment: prev[prod.product_id]?.comment || "",
                                },
                              }))
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <textarea
                        className="review-textarea"
                        placeholder="Nhận xét của bạn..."
                        rows={3}
                        value={reviewData[prod.product_id]?.comment || ""}
                        onChange={(e) =>
                          setReviewData((prev) => ({
                            ...prev,
                            [prod.product_id]: {
                              ...prev[prod.product_id],
                              comment: e.target.value,
                            },
                          }))
                        }
                      />
                      <button
                        className="review-submit-btn"
                        onClick={() => handleReview(prod.product_id)}
                      >
                        Gửi đánh giá
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => {
                  router.replace("/his");
                }}
                className="back-button"
              >
                ← Trở về lịch sử đơn hàng
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
