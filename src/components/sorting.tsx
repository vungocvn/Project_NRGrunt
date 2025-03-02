import "@/styles/product.css";
export default function Sorting() {
    return (
        <div className="container-body hide-on-mobile-tablet">
        <div className="sorting-section">
            <div className="sorting-options">
                <span>Sắp xếp theo</span>
                <button className="active">Phổ biến</button>
                <button>Mới nhất</button>
                <button>Bán chạy</button>
            </div>
            <div className="price-filter">
                <select>
                    <option value="price">Giá</option>
                    <option value="asc">Tăng dần</option>
                    <option value="desc">Giảm dần</option>
                </select>
            </div>
        </div>
        <div className="pagination">
            <button>  <i className=" fa-solid fa-angle-left"></i></button>
            <span>1/14</span>
            <button>  <i className=" fa-solid fa-angle-right"></i></button>
        </div>
    </div>
    );
}