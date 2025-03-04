
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "@/styles/product.css";
import { on } from 'events';
import { pages } from 'next/dist/build/templates/app-page';
interface Props {
    onSelectProduct: (product: any) => void
    listProduct: [], 
    category: []
}

export const ProdList: React.FC<Props> = ({onSelectProduct,listProduct,category}) =>  {
     const [lstProduct, setLstProduct] = useState([])

    useEffect(() => {
        setLstProduct(listProduct)
        // getAllProduct()
    }, [listProduct])
    return (
    <>
      
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          {lstProduct.map((item) => renderItem(item['name'],item['price'],item['image'],()=>{onSelectProduct(item)},
          item['discount'], item['quantity'], item['origin'], item['category_id'], category))}
          
            
        </div>
        {/* <ul className="pagination home-product-pagination">
                <li className="pagination-item">
                    <a href="" className="pagination-link">
                        <i className="pagination-icon fa-solid fa-angle-left"></i>
                    </a>
                </li>
                <li className="pagination-item pagination-active">
                    <a href="" className="pagination-link">1 </a>
                </li>
                <li className="pagination-item">
                    <a href="" className="pagination-link">2 </a>
                </li>
                <li className="pagination-item">
                    <a href="" className="pagination-link">3 </a>
                </li>
                <li className="pagination-item">
                    <a href="" className="pagination-link">4 </a>
                </li>
                <li className="pagination-item">
                    <a href="" className="pagination-link">5 </a>
                </li>
                <li className="pagination-item">
                    <a href="" className="pagination-link">... </a>
                </li>
                <li className="pagination-item">
                    <a href="" className="pagination-link">14 </a>
                </li>
                <li className="pagination-item">
                    <a href="" className="pagination-link">
                        <i className="pagination-icon fa-solid fa-angle-right"></i>
                    </a>
                </li>
            </ul> */}
    </>
  );
}

export default ProdList
const renderItem = (title:any,price:any,image:any,onclick?:()=>void, discount?: any,
 quantity?: any, origin?: any,category_id?: number, category?: []) => {
    let category_item = category?.length!=undefined? category.filter((item:any) => item['id'] == category_id)[0]:null;
    let category_name = category_item !=null? category_item['name']:'';
    function formatVND(amount:any) {
        return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
    }
    return(
        <div className="content-cover-nav-one" onClick={onclick}>
        <div className="content-cover-sub">
            <div className="content-cover-image">
                <img src="./image/la1.webp" alt="" />
                {/* <img src={image} alt="" /> */}
            </div>

            <div className="favourite"> <i className="fa-solid fa-check"></i> Yêu thích</div>
            <div className="sale">
                <div className="sale-one">{discount}%</div>
                <div className="sale-two">GIẢM</div>
            </div>

        </div>
        <div className="title-many-cover">

            <div className="content-cover-title">
                <p>{title} </p>
            </div>
            <div className="content-cover-price">
                <div className="price-cover">
                    <div className="price-one">{formatVND(price)}</div>
                </div>
                <div className="price-cover">
                    <div className="price-three">{formatVND(price-(price*(discount/100)))}</div>
                </div>
            </div>
            <div className="content-icon-cover">
                <div className="content-icon-one">
                    <i className="fa-solid fa-heart"></i>
                </div>
                <div className="cover">
                    <div className="content-icon-star">
                        <div className="start-one">
                            <i className="fa-solid fa-star"></i></div>
                        <div className="start-one">
                            <i className="fa-solid fa-star"></i></div>
                        <div className="start-one">
                            <i className="fa-solid fa-star"></i></div>
                        <div className="start-one">
                            <i className="fa-solid fa-star"></i></div>
                        <div className="start-on">
                            <i className="fa-solid fa-star"></i></div>
                    </div>
                    <div className="buy">Đã bán {quantity}</div>
                </div>
            </div>
            <div className="content-below">
                <div className="below-left">{category_name}</div>
                <div className="below-right"><i className="fa-solid fa-location-dot"></i>{origin}</div>
            </div>
        </div>
    </div>
    )
}