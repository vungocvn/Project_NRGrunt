import React, { useEffect, useState } from 'react';
import "@/styles/product.css";
import { useRouter } from 'next/router';

interface Props {
    onSelectProduct: (product: any) => void;
    listProduct: any[];
    category: any[];
}

interface Productlist {
    sold_quantity: number;
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

export const ProdList: React.FC<Props> = ({ onSelectProduct, listProduct, category }) => {
    const [lstProduct, setLstProduct] = useState<Productlist[]>([]);
    const router = useRouter();

    useEffect(() => {
        setLstProduct(listProduct);
    }, [listProduct]);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 body-content-nav">
                {lstProduct.map((item) => renderItem(item, onSelectProduct, category))}
            </div>
        </>
    );
};

export default ProdList;

const renderItem = (
    item: Productlist,
    onSelectProduct: (product: any) => void,
    category: any[]
) => {
    const categoryItem = category.find((itemCategory: any) => itemCategory.id === item.category_id);
    const categoryName = categoryItem ? categoryItem.name : '';

    function formatVND(amount: any) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }

    return (
        <div className="content-cover-nav-one" onClick={() => onSelectProduct(item)}>
            <div className="content-cover-sub">
                <div className="content-cover-image">
                    {/* Sửa lại đường dẫn ảnh */}
                    <img src={`http://127.0.0.1:8000${item.image}`} alt={item.name} />
                </div>
                <div className="favourite">
                    <i className="fa-solid fa-check"></i> Yêu thích
                </div>
                <div className="sale">
                    <div className="sale-one">{item.discount * 100}%</div>
                    <div className="sale-two">GIẢM</div>
                </div>
            </div>
            <div className="title-many-cover">
                <div className="content-cover-title">
                    <p>{item.name}</p>
                </div>
                <div className="content-cover-price">
                    <div className="price-cover">
                        <div className="price-one">{formatVND(item.price)}</div>
                    </div>
                    <div className="price-cover">
                        <div className="price-three">{formatVND(item.price - item.price * item.discount)}</div>
                    </div>
                </div>
                <div className="content-icon-cover">
                    <div className="content-icon-one">
                        <i className="fa-solid fa-heart"></i>
                    </div>
                    <div className="cover">
                        <div className="content-icon-star">
                            <div className="start-one">
                                <i className="fa-solid fa-star"></i>
                            </div>
                            <div className="start-one">
                                <i className="fa-solid fa-star"></i>
                            </div>
                            <div className="start-one">
                                <i className="fa-solid fa-star"></i>
                            </div>
                            <div className="start-one">
                                <i className="fa-solid fa-star"></i>
                            </div>
                            <div className="start-on">
                                <i className="fa-solid fa-star"></i>
                            </div>
                        </div>
                        <div className="buy">Đã bán {item.sold_quantity ?? 0}</div>
                    </div>
                </div>
                <div className="content-below">
                    <div className="below-left">{categoryName}</div>
                    <div className="below-right">
                        <i className="fa-solid fa-location-dot"></i>{item.origin}
                    </div>
                </div>
            </div>
        </div>
    );
};
