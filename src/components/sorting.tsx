import "@/styles/product.css";
interface Props { 
    onTrending?: () => void,
    onNew?: () => void,
    onSortPrice?: (value: React.ChangeEvent<HTMLSelectElement>) => void
}
export const Sorting:React.FC<Props> = ({onTrending, onNew, onSortPrice}) => {
    return (
        <div className="container-body">
            <div className="sorting-section">
                <div className="sorting-options">
                    <span>Sắp xếp theo</span>
                    <button className="active" onClick={onTrending}>Bán chạy</button>
                    <button onClick={onNew}>Mới nhất</button>
                </div>
                <div className="price-filter">
                    <select onChange={onSortPrice}>
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