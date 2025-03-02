import { useRouter } from "next/router";
export default function HeaderComponent({onLogin,onRegister,isLogin, fullName}:{onLogin?:any,onRegister?:any, isLogin?:boolean, fullName?:string})  {
    const router = useRouter();
    
    const handleBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push("./shop"); 
        }
    };
    return (
        <>
             <div className="header-cover">
                    <div className="header-tab">
                        <div className="sub hide-on-tablet hide-on-mobile">
                            <div className="header-cover-left">
                                <ul className="header-cover-ul">
                                    <li className="header-cover-li">
                                        Vào cửa hàng trên ứng dụng NRGrunt shop
                                    </li>
                                    <li className="header-cover-li">
                                        <span className="header-cover-span">Kết nối</span>
                                        <i className="fa-brands fa-facebook"></i>
                                        <i className="fa-brands fa-instagram"></i>
                                    </li>
                                </ul>
                            </div>
                            <div className="header-cover-right">
                                <ul className="header-cover-ul-one">
                                    <li className="header-cover-li-a header-cover-li-a-notify">
                                        <i className="fa-solid fa-bell"></i>
                                        Thông báo
                                        <div className="header-notification">
                                            <header className="header-notification-header">
                                                <h3>Thông báo mới nhận</h3>
                                            </header>
                                            <ul className="header-notify-list">
                                                <li className="header-notify-item header-notify-item--viewed">
                                                    <a href="" className="header-notify-link">
                                                        <img src="https://medias.watsons.vn/publishing/WTCVN-212427-side-zoom.jpg?version=1733931022" alt="" className="header-notify-img"  
                                                       />
                                                        <div className="header-notify-info">
                                                            <span className="header-notify-name">Xác thực chính hãng nguồn gốc các sản phẩm</span>
                                                            <span className="header-notify-descriotion">Hidden Tag là giải pháp xác thực hàng chính hãng bằng công nghệ tiên tiến nhất hiện nay.</span>
                                                        </div>

                                                    </a>
                                                </li>
                                                <li className="header-notify-item header-notify-item--viewed">
                                                    <a href="" className="header-notify-link">
                                                        <img src="https://medias.watsons.vn/publishing/WTCVN-212427-side-zoom.jpg?version=1733931022" alt="" className="header-notify-img" />
                                                        <div className="header-notify-info">
                                                            <span className="header-notify-name">Sale sốc bộ dưỡng da Ohui The First tái tạo trẻ hoá da </span>
                                                            <span className="header-notify-descriotion">Giá chỉ còn 375.000(giá gốc 1.250.000 vnd).</span>
                                                        </div>

                                                    </a>
                                                </li>
                                                <li className="header-notify-item ">
                                                    <a href="" className="header-notify-link">
                                                        <img src="https://medias.watsons.vn/publishing/WTCVN-212427-side-zoom.jpg?version=1733931022" alt="" className="header-notify-img" />
                                                        <div className="header-notify-info">
                                                            <span className="header-notify-name">3CE chính thức ra mắt dòng son thỏi mới với mẫu mã bắt mắt và rất xinh đẹp</span>
                                                            <span className="header-notify-descriotion">Một làn môi căng mềm, quyến rũ với sắc màu nổi bật luôn là điều mà các quý cô ao ước.</span>
                                                        </div>

                                                    </a>
                                                </li>
                                            </ul>
                                            <div className="header-notify-footer">
                                                <a href="" className="header-notify-footer-btn">Xem tất cả</a>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="header-cover-li-a">
                                        <i className="header-navbar-icon fa-regular fa-circle-question"></i>
                                        Trợ giúp
                                    </li>
                                    {isLogin ? (
                                         <li className="header-cover-li-a header-cover-li-strong">Xin chào {fullName}</li>
                                    ):(
                                        <>
                                          <li className="header-cover-li-a header-cover-li-strong" onClick={onRegister}>  Đăng ký </li>
                                          <li className="header-cover-li-a header-cover-li-strong" onClick={onLogin}>  Đăng nhập</li>
                                        </>
                                      
                                    )}
                                   
                                   
                                </ul>
                            </div>
                        </div>

                        <div className="header-with-search ">
                            <label htmlFor="mobile-search-checkbox" className="header-mobile-search">
                                <i className="header-mobile-search-icon fa-solid fa-magnifying-glass"></i>
                            </label>
                            <div className="header-logo hide-on-tablet">
                                <img src="../image/logo.png" alt="" className="header-logo-img"  onClick={()=>{handleBack()}}/>
                            </div>
                                <input type="checkbox" hidden id="mobile-search-checkbox"  className="header-search-checkbox"/>
                            <div className="header-search">
                                <div className="header-search-input-wrap">
                                    <input type="text" className="header-search-input" placeholder="Nhập để tìm kiếm sản phẩm" />
                                    {/* search history */}
                                    <div className="header-search-history">
                                        <h3 className="header-search-history-heading">Lịch sử tìm kiếm</h3>
                                        <ul className="header-search-history-list">
                                            <li className="header-search-history-item">
                                                <a href="">Kem dưỡng dạng cream</a>
                                            </li>
                                            <li className="header-search-history-item">
                                                <a href="">Serum chống lão hoá</a>
                                            </li>
                                            <li className="header-search-history-item">
                                                <a href="">Son kem lì Maybeline</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="header-search-select">
                                    <span className="header-search-select-label">Trong shop  </span>
                                    <i className="header-search-select-icon fa-solid fa-angle-down"></i>

                                    <ul className="header-search-option">
                                        <li className="header-search-option-item header-search-option-item-active">
                                            <span>Trong shop</span>
                                            <i className="fa-solid fa-check"></i>
                                        </li>
                                        <li className="header-search-option-item">
                                            <span>Ngoài shop</span>
                                            <i className="fa-solid fa-check"></i>
                                        </li>
                                    </ul>
                                </div>
                                <button className="header-search-btn">
                                    <i className="header-search-btn-icon fa-solid fa-magnifying-glass"></i>
                                </button>
                            </div>
                            <div className="header-cart ">
                                <i className="header-cart-icon fa-solid fa-cart-shopping" onClick={()=>router.push("/cart")}></i>
                            </div>

                        </div>
                    </div>
                    <ul className="header-sort-bar">
                         <li className="header-sort-item">
                         <a href="" className="header-sort-link">Liên quan</a>
                         </li>
                         <li className="header-sort-item header-sort-item-active">
                         <a href="" className="header-sort-link ">Mới nhất</a>
                         </li>
                         <li className="header-sort-item">
                         <a href="" className="header-sort-link">Bán chạy</a>
                         </li>
                         <li className="header-sort-item">
                         <a href="" className="header-sort-link">Giá</a>
                         </li>
                    </ul>
            </div>
        </>
    );
}