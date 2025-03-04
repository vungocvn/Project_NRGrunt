"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

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
    created_at:  string,
    updated_at: string,
    category_id: number,
    quantity: number,
    origin: string,
    discount: number,
    description: string,
}
export const ProdDetail: React.FC<Props> = ({onBack, idProduct}) =>  {
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
    useEffect(() => {
      console.log(idProduct);
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
    function formatVND(amount:any) {
      return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  }
  return (

    <>
      <div className="product-container">
      <i className="fa-solid fa-arrow-left" onClick={onBack}></i>
        {/* Ảnh sản phẩm */}
        <div className="product-gallery">
          {/* <img src="./image/beplain.jpg" alt="" className="product-image" /> */}
          <img src={product?.image} alt="" className="product-image" />
        </div>

        {/* Thông tin sản phẩm */}
        <div className="product-details">
          <h2>{product?.name}</h2>
          <p>
            <strong>Xuất xứ:</strong> {product?.origin}
          </p>
          <p>
            <strong>Giá:</strong>{" "}
            <span className="discount-price">{formatVND(product?.price)}</span>{" "}
            <del className="original-price">{formatVND(product?.price*(product?.discount/100))}</del> (-{product?.discount}%)
          </p>
          <button className="buy-now">Mua Ngay</button>
          <button className="add-to-cart"><i className="fa-solid fa-cart-shopping"></i>Thêm Vào Giỏ</button>

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
    </>
  );
}

export default ProdDetail