"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setCount } from "@/store/slices/productsSlice";
import { toast } from "react-toastify";

interface Props {
  onBack: (product: any) => void;
  idProduct: number;
}
interface Productdetails {
  id: number;
  name: string;
  status: number;
  price: number;
  image: string;
  created_at: string;
  updated_at: string;
  category_id: number;
  quantity: number;
  origin: string;
  discount: number;
  description: string;
}

export const ProdDetail: React.FC<Props> = ({ onBack, idProduct }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const [token, setToken] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Productdetails>({
    id: 0,
    name: "",
    status: 1,
    price: 12000,
    image: "",
    quantity: 100,
    origin: "",
    discount: 0,
    description: "",
    created_at: "2025-03-01 13:39:24",
    updated_at: "2025-03-01 13:39:24",
    category_id: 1,
  });
  useEffect(() => {
    const token = Cookies.get("token_portal") || "";
    if (token) setToken(token);

    axios.get(`http://127.0.0.1:8000/api/products/${idProduct}`)
      .then((res) => {
        if (res.data.status === 200) setProduct(res.data.data);
        else alert("Sign up error, please try again!");
      })
      .catch(() => alert("Sign up error, please try again!"));
  }, [id]);

  useEffect(() => {
    const el = document.querySelector(".product-container");
    if (el) {
      const headerHeight = 110;
      const y = el.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [product]);
  const [isExpanded, setIsExpanded] = useState(false);
  function getCart() {
    const token = Cookies.get("token_portal") || "";
    axios.get(`http://127.0.0.1:8000/api/carts`, {
      params: { page: 1, page_size: 100 },
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.data.status === 200) dispatch(setCount(res.data.data.length));
      })
      .catch(console.log);
  }

  function addCart(type: string) {
    if (!token) {
      toast.info("please login to buy!", { position: "top-center", autoClose: 3000 });
      return;
    }
    if (product.quantity <= 0) {
      toast.warning("Product is out of stock, cannot be added to cart!", { position: "top-center", autoClose: 3000 });
      return;
    }
    axios.post(`http://127.0.0.1:8000/api/carts`, { product_id: idProduct, quantity }, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.data.status === 200) {
          if (type === "buy") router.push("/cart");
          else toast.success("Add to cart successfully!");
          getCart();
        } else {
          toast.error("Add to cart error!", { position: "top-right" });
        }
      })
      .catch((error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          toast.info("please login to buy!", { position: "top-center", autoClose: 3000 });
        } else {
          toast.error("An error occurred, please try again later.", { position: "top-right" });
        }
      });
  }

  function formatVND(amount: any) {
    return parseFloat(amount).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }
  interface Review {
    user_name: string;
    rating: number;
    comment: string;
    created_at: string;
  }
  const [reviews, setReviews] = useState<Review[]>([]);
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/products/${idProduct}`)
      .then((res) => {
        if (res.data.status === 200) setProduct(res.data.data);
        else alert("Sign up error, please try again!");
      })
      .catch(() => alert("Sign up error, please try again!"));
    axios.get(`http://127.0.0.1:8000/api/reviews/${idProduct}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.data.status === 200) setReviews(res.data.data);
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err);
      });
  }, [idProduct]);
  return (
    <div className="product-container">
      <div className="product-cover">
        <div className="product-gallery">
          <img
            src={`http://127.0.0.1:8000${product?.image}`}
            alt=""
            className="product-image"
            style={{ width: "100%", height: "50%", objectFit: "cover" }}
          />
        </div>

        <div className="product-details">
          <h2>{product?.name}</h2>
          <p><strong>Xuất xứ:</strong> {product?.origin}</p>
          <p>
            <strong>Giá:</strong>{" "}
            <span className="discount-price">{formatVND(product?.price - product?.price * product?.discount)}</span>{" "}
            <del className="original-price">{formatVND(product?.price)}</del>{" "}
            ({product?.discount * 100}%)
          </p>
          <div className="quantity-cell-border" style={{ width: 80, textAlign: "center" }}>
            <span onClick={() => setQuantity(Math.max(1, quantity - 1))} className="quantity-btn btn-one">-</span>
            <span className="quantity">{quantity}</span>
            <span onClick={() => setQuantity(quantity + 1)} className="quantity-btn btn-two">+</span>
          </div>
          <div className="button-detail">
            {product.quantity > 0 ? (
              <>
                <button className="buy-now" onClick={() => addCart("buy")}>Mua Ngay</button>
                <button className="add-to-cart" onClick={() => addCart("cart")}>
                  <i className="fa-solid fa-cart-shopping"></i> Thêm Vào Giỏ
                </button>
              </>
            ) : (
              <button
                className="out-of-stock"
                style={{
                  backgroundColor: "#ccc",
                  color: "#666",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "not-allowed",
                  fontWeight: "bold"
                }}
                disabled
              >
                Hết hàng
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="product-info">
        <h3>Thông tin sản phẩm</h3>
        <div style={{ position: "relative" }}>
          <div
            className="desc"
            style={{
              maxHeight: isExpanded ? "none" : "200px",
              overflow: "hidden",
              position: "relative",
              transition: "max-height 0.3s ease"
            }}
            dangerouslySetInnerHTML={{ __html: product?.description }}
          ></div>

          {!isExpanded && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "60px",
                background: "linear-gradient(rgba(255,255,255,0), #fff)",
                pointerEvents: "none",
              }}
            ></div>
          )}

          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                background: "transparent",
                border: "1px solid #01ab78",
                padding: "6px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                color: "#01ab78",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#e0f7f2")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              {isExpanded ? "Ẩn bớt nội dung" : "Xem thêm nội dung"}
            </button>


          </div>
        </div>
      </div>
      <div className="product-reviews">
        <h3>Đánh giá sản phẩm</h3>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="review-item">
              <p><strong>{review.user_name}</strong> - {review.created_at}</p>
              <p>Đánh giá: {review.rating} / 5</p>
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <p></p>
        )}
      </div>

    </div>
  );
};

export default ProdDetail;
