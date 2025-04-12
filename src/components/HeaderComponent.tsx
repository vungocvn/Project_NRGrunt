import { useRouter } from "next/router";
import "@/styles/reponsive.css";
import Cookies from "js-cookie";

import { ChangeEventHandler, use, useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setIsLogin, setToken, setUser } from "@/store/slices/authSlice";
import { Value } from "sass";
import { setCount, setSearch } from "@/store/slices/productsSlice";
import Link from "next/link";
export default function HeaderComponent({ onLogin, onRegister, fullName, onHome, isHome, onSearch, search }: { onLogin?: any; onRegister?: any; fullName?: string; onHome?: () => void; isHome?: boolean; onSearch?: (value: string) => void;
     search?: string; }) {
    const router = useRouter();
    const { isLogin, user, token, count } = useSelector((state: any) => ({
        isLogin: state.auth.isLogin, // false
        user: state.auth.user,
        token: state.auth.token,
        count: state.product.count
    }))
    const dispatch = useDispatch();
    const [searchInput, setSearchInput] = useState(search || "");

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push("/shop");
        }
    };
    const forceLogout = (message = "Bạn đã đăng xuất") => {
        Cookies.remove("token_portal");
        dispatch(setIsLogin(false));
        dispatch(setUser(null));
        dispatch(setToken(""));
        dispatch(setCount(0));
        router.push("/shop");
        console.log(message);
    };

    const handlerLogout = () => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất không?");
        if (!isConfirmed) return;

        const token = Cookies.get("token_portal");
        if (!token) {
            forceLogout("Token không tồn tại");
            return;
        }

        axios
            .post(
                "http://127.0.0.1:8000/api/auth/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            .then((response) => {
                console.log("Logout response:", response.data);

                if (response.status === 401) {
                    alert("Phiên đăng nhập đã hết hạn. Tự động đăng xuất!");
                } else {
                    alert("Đăng xuất thành công!");
                }

                forceLogout();
            })
            .catch((error) => {
                console.error("Lỗi khi logout:", error);
                alert("Đăng xuất thất bại!");
            });
    };
    const handleSearch = () => {
        dispatch(setSearch(searchInput));
        onSearch?.(searchInput);
        setSearchInput("");
      };
      

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    useEffect(() => {
        if (token && token !== "") {
            axios
                .post(
                    "http://127.0.0.1:8000/api/auth/check-auth",
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                .then((response) => {
                    if (response.data.status === 200) {
                    }
                })
                .catch((error) => { });
        }
    }, [isLogin]);

    return (
        <>
            <div className="header-cover">
                <div className="header-tab">
                    <div className="sub">
                        <div className="header-cover-left">
                            <ul className="header-cover-ul">
                                <li className="header-cover-li">Vào cửa hàng trên ứng dụng NRGrunt shop</li>
                                <li className="header-cover-li">
                                    <span className="header-cover-span">Kết nối</span>
                                </li>
                                <li className="header-cover-li">
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
                                                    <img src="https://medias.watsons.vn/publishing/WTCVN-212427-side-zoom.jpg?version=1733931022" alt="" className="header-notify-img" />
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
                                            <a href="" className="header-notify-footer-btn">
                                                Xem tất cả
                                            </a>
                                        </div>
                                    </div>
                                </li>
                                <li className="header-cover-li-a">
                                    <i className="header-navbar-icon fa-regular fa-circle-question"></i>
                                    Trợ giúp
                                </li>
                                {isLogin && token != '' ? (
                                    <li className="header-cover-li-a header-cover-li-strong">
                                        <div className="header-user-dropdown">
                                            <div className="header-user-info">
                                                <img
                                                    src="http://127.0.0.1:8000/storage/images/avatar.jpg"
                                                    alt="avatar"
                                                    className="user-avatar"
                                                />
                                                <span className="username">Xin chào {user?.email}</span>
                                            </div>
                                            <ul className="user-dropdown-menu">
                                                <li>
                                                    <Link href="/his"><i className="fa-solid fa-cart-shopping"></i>Đơn hàng của bạn</Link>
                                                </li>
                                                <li onClick={handlerLogout}>
                                                    <span><i className="fa-solid fa-right-from-bracket"></i>Đăng xuất</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>

                                ) : (
                                    <>
                                        <li className="header-cover-li-a header-cover-li-strong" onClick={onRegister}>
                                            Đăng ký
                                        </li>
                                        <li className="header-cover-li-a header-cover-li-strong" onClick={onLogin}>
                                            Đăng nhập
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="header-with-search ">
                        <label htmlFor="mobile-search-checkbox" className="header-mobile-search">
                            <i className="header-mobile-search-icon fa-solid fa-magnifying-glass"></i>
                        </label>
                        <div className="header-logo">
                            <img src="../image/logo.png" alt="" className="header-logo-img" onClick={isHome == true ? onHome : handleBack} />
                        </div>
                        <input type="checkbox" hidden id="mobile-search-checkbox" className="header-search-checkbox " />
                        <div className="header-search">
                            <div className="header-search-input-wrap">
                                <input
                                    type="text"
                                    className="header-search-input"
                                    placeholder="Nhập để tìm kiếm sản phẩm"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />


                                {/* search history */}
                                <div className="header-search-history">
                                    <h3 className="header-search-history-heading">Lịch sử tìm kiếm</h3>
                                    <ul className="header-search-history-list">
                                        <li className="header-search-history-item">
                                            <a href="">Sữa rửa mặt</a>
                                        </li>
                                        <li className="header-search-history-item">
                                            <a href="">Kem dưỡng</a>
                                        </li>
                                        <li className="header-search-history-item">
                                            <a href="">Son môi</a>
                                        </li>
                                        <li className="header-search-history-item">
                                            <a href="">Dầu dưỡng tóc</a>
                                        </li>
                                        <li className="header-search-history-item">
                                            <a href="">Serum</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="header-search-select">
                                <span className="header-search-select-label">Trong shop </span>
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
                            <button className="header-search-btn" onClick={handleSearch}>
                                <i className="header-search-btn-icon fa-solid fa-magnifying-glass"></i>
                            </button>

                        </div>
                        <div className="header-cart">
                            <i className="header-cart-icon fa-solid fa-cart-shopping header-cart-wrap" onClick={() => router.push("/cart")}>
                                {count > 0 && <p className="header-cart-quantity" >{count}</p>}
                            </i>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
