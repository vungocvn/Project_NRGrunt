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
  function getCart() {
    const token = Cookies.get("token_portal") || "";
    axios
      .get(`http://127.0.0.1:8000/api/carts`, {
        params: { page: 1, page_size: 100 },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.status === 200) {
          dispatch(setCount(res.data.data.length));
        }
        console.log(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const [token, setToken] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  function plusQuantity() {
    setQuantity(quantity + 1);
  }
  function minusQuantity() {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Productdetails>({
    id: 1,
    name: "tivi",
    status: 1,
    price: 12000,
    image: "storage/images/ottpJefChM.jpg",
    quantity: 100,
    origin: "Việt Nam",
    discount: 0,
    description: "Tivi thì để xem thôi chứ làm gì?",
    created_at: "2025-03-01 13:39:24",
    updated_at: "2025-03-01 13:39:24",
    category_id: 1,
  });

  function addCart(type: string) {
    if (!token) {
      toast.info("please login to buy!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    axios
      .post(
        `http://127.0.0.1:8000/api/carts`,
        { product_id: idProduct, quantity: quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        if (res.data.status === 200) {
          if (type === "buy") {
            router.push("/cart");
          } else {
            toast.success("Add to cart successfully!", {
              position: "top-right",
              autoClose: 2000,
            });
          }
          getCart();
        } else {
          toast.error("Add to cart error!", {
            position: "top-right",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          toast.info("please login to buy!", {
            position: "top-center",
            autoClose: 3000,
          });
        } else {
          toast.error("An error occurred, please try again later.", {
            position: "top-right",
          });
        }
      });
  }

  useEffect(() => {
    const token = Cookies.get("token_portal") || "";
    if (token) {
      setToken(token);
    }
    axios
      .get(`http://127.0.0.1:8000/api/products/${idProduct}`)
      .then((res) => {
        if (res.data.status === 200) {
          setProduct(res.data.data);
        } else {
          alert("Sign up error, please try again!");
        }
      })
      .catch((error) => {
        alert("Sign up error, please try again!");
      });
  }, [id]);

  function formatVND(amount: any) {
    var formatter = parseFloat(amount);
    return formatter.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }

  useEffect(() => {
    const el = document.querySelector(".product-container");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, [product]);

  useEffect(() => {
    setSelected(selectAll);
  }, [selectAll]);

  return (
    <>
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
            <p>
              <strong>Xuất xứ:</strong> {product?.origin}
            </p>
            <p>
              <strong>Giá:</strong>{" "}
              <span className="discount-price">
                {formatVND(product?.price - product?.price * product?.discount)}
              </span>{" "}
              <del className="original-price">
                {formatVND(product?.price)}
              </del>{" "}
              ({product?.discount * 100}%)
            </p>
            <div
              className="quantity-cell-border"
              style={{ width: 80, textAlign: "center" }}
            >
              <span onClick={minusQuantity} className="quantity-btn btn-one ">
                -
              </span>
              <span className="quantity">{quantity}</span>
              <span onClick={plusQuantity} className="quantity-btn btn-two">
                +
              </span>
            </div>
            <div className="button-detail">
              <button className="buy-now" onClick={() => addCart("buy")}>Mua Ngay</button>
              <button className="add-to-cart" onClick={() => addCart("cart")}>
                <i className="fa-solid fa-cart-shopping"></i> Thêm Vào Giỏ
              </button>
              <div style={{ marginTop: "12px" }}>
              </div>
            </div>
          </div>
        </div>
        <div className="product-info">
          <h3>Thông tin sản phẩm</h3>
          <div className="desc" dangerouslySetInnerHTML={{ __html: product?.description }}></div>
        </div>
      </div>
    </>
  );
};

export default ProdDetail;
