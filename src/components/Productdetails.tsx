"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

interface Props {
  onBack: (product: any) => void
  idProduct: number
}
interface Productdetails {
  id: number,
  name: string,
  status: number,
  price: number,
  image: string,
  created_at: string,
  updated_at: string,
  category_id: number,
  quantity: number,
  origin: string,
  discount: number,
  description: string,
}
export const ProdDetail: React.FC<Props> = ({ onBack, idProduct }) => {
  const [token, setToken] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
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
    "id": 1,
    "name": "tivi",
    "status": 1,
    "price": 12000,
    "image": "./public/images/electronics.jpg",
    "quantity": 100,
    "origin": "Việt Nam",
    "discount": 0,
    "description": "Tivi thì để xem thôi chứ làm gì?",
    "created_at": "2025-03-01 13:39:24",
    "updated_at": "2025-03-01 13:39:24",
    "category_id": 1
  });
  function addCart() {
    axios.post(`http://127.0.0.1:8000/api/carts`, { product_id: idProduct, quantity: quantity }
      , {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then(res => {
        console.log(res.data);
        if (res.data.status === 200) {
          router.push("/cart");
          alert("Thêm vào giỏ hàng thành công");
        } else {
          alert("Thêm vào giỏ hàng thất bại");
        }
      })
      .catch(error => console.log(error))
    console.log("access_token", token);
  }
  useEffect(() => {
    const token = Cookies.get('token_cua_Ngoc') || "";
    if (token) {
      setToken(token);
    }
    axios.get(`http://127.0.0.1:8000/api/products/${idProduct}`)
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
    return formatter.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  }
  return (

    <>

      <div className="product-container">
        <i className="icon-back fa-solid fa-arrow-left" onClick={onBack}></i>
        {/* Ảnh sản phẩm */}
        <div className="product-cover">
          <div className="product-gallery">
            <img src={product?.image} alt="" className="product-image" style={{width:'100%', height:'50%',objectFit:'cover'}} />
            {/* <img src="./image/svr.jfif" alt="" /> */}
          </div>

          {/* Thông tin sản phẩm */}
          <div className="product-details">
            <h2>{product?.name}</h2>
            <p>
              <strong>Xuất xứ:</strong> {product?.origin}
            </p>
            <p>
              <strong>Giá:</strong>{" "}
              <span className="discount-price">{formatVND(product?.price-(product?.price * (product?.discount / 100)))}</span>{" "}
              <del className="original-price">{formatVND(product?.price)}</del> ({product?.discount}%)
            </p>
            <div className="quantity-cell-border" style={{ width: 80, textAlign: "center" }}>
              <span onClick={() => minusQuantity()} className="quantity-btn btn-one ">-</span>
              <span className="quantity">{quantity}</span>
              <span onClick={() => plusQuantity()} className="quantity-btn btn-two">+</span>
            </div>
            <div className="button-detail">
              <button className="buy-now">Mua Ngay</button>
              <button className="add-to-cart" onClick={addCart}><i className="fa-solid fa-cart-shopping"></i> Thêm Vào Giỏ</button>
            </div>


            {/* Thông tin sản phẩm */}
            <div className="product-info">
              <h3>Thông Tin</h3>
              <p>
                {product?.description}
              </p>
              {/* <h3>Thông Số</h3>
            <ul>
              <li>Trọng lượng: 300g</li>
              <li>Thành phần: Tinh dầu thiên nhiên</li>
              <li>Hạn sử dụng: 3 năm</li>
            </ul>
            <h3>Thành Phần</h3>
            <p>Chiết xuất từ Hoa Sen, Sữa Acacia, Dầu hạnh nhân, Vitamin E.</p>
            <h3>Cách Dùng</h3> */}
              {/* <p>Thoa đều lên da sau khi tắm, massage nhẹ nhàng để sản phẩm thẩm thấu.</p> */}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default ProdDetail