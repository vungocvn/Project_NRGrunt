"use client";
import axios from "axios";
import { useRouter } from "next/router";
import ProdDetail from "./Productdetails";
import ProdList from "./ProductList";
import { ChangeEvent, useEffect, useState } from "react";
import HeaderComponent from "./HeaderComponent";
import { getAllProd } from "../pages/api/api";
import Cookies from "js-cookie";
import Banner from "@/components/banner";
import { Sorting } from "@/components/sorting";
import exp from "constants";
import { useDispatch, useSelector } from "react-redux";
import { setIsLogin, setToken, setUser } from "@/store/slices/authSlice";
import { setCount, setDataProduct, setLoading, setSearch, setTotal, Total } from "@/store/slices/productsSlice";
import LoadingScreen from "./Loading";
import ForgotPasswordModal from "@/components/ForgotPasswordClientModal";
import { toast } from "react-toastify";
export default function Shop() {
    const [selectedProd, setSelectedProd] = useState(null);
    const [openModel, setOpenModel] = useState(false);
    const [selectAuth, setSelectAuth] = useState(true);
    const [openForgotModal, setOpenForgotModal] = useState(false);

    const [selectCategory, setSelectCategory] = useState(null);
    const [lstCategory, setLstCategory] = useState<any>([]);

    // State for Register
    const [register, setRegister] = useState({ name: "", email: "", password: "" });

    // State for Login
    const [login, setLogin] = useState({ email: "", password: "", role: "Customer" });

    // State for Forgot Password
    const [forgotEmail, setForgotEmail] = useState("");
    const [openResetModal, setOpenResetModal] = useState(false);
    const [resetData, setResetData] = useState({ email: "", otp: "", newPassword: "" });

    const dispatch = useDispatch();
    const { total, isLoading, dataProduct, search, token }: { total: Total; isLoading: boolean; dataProduct: any; search: string; token: string } = useSelector(
        (state: any) => ({
            total: state.product.totalProduct,
            isLoading: state.product.isLoading,
            dataProduct: state.product.dataProduct,
            search: state.product.search,
            token: state.auth.token,
        })
    );

    function openModelHandler(element: boolean) {
        if (!openModel) {
            setSelectAuth(element);
            setOpenModel(true);
        } else {
            setOpenModel(false);
        }
    }
    function isValidEmail(email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      }      
    // Forgot Password modal toggling
    function openForgotModalHandler() {
        // Close the login/register modal if open
        setOpenModel(false);
        // Open forgot password modal
        setOpenForgotModal(true);
    }

    function closeForgotModalHandler() {
        setOpenForgotModal(false);
    }

    // ========== API: getAllProduct ==========
    function getAllProduct({
        id_category,
        sortOder,
        sort_col,
        pageIndex,
    }: {
        id_category?: number;
        sortOder?: string;
        sort_col?: string;
        pageIndex?: number;
    }) {
        const currentPage = pageIndex || total.pageIndex;
        dispatch(setDataProduct([]));
        dispatch(setLoading(true));

        try {
            axios
                .get("http://127.0.0.1:8000/api/products", {
                    params: {
                        page_index: currentPage,
                        page_size: total.pageSize,
                        id_category,
                        sort_order: sortOder,
                        sort_col,
                        name: search,
                    },
                })
                .then((res) => {
                    if (res.data.status === 200) {
                        const items = res.data.data.items;
                        if (search && items.length === 0) {
                            toast.info("Không tìm thấy sản phẩm nào phù hợp!", {
                                position: "top-center",
                                autoClose: 3000,
                                className: "custom-toast",
                                progressClassName: "custom-progress"
                            });
                        }
                        dispatch(
                            setTotal({
                                ...total,
                                pageIndex: currentPage,
                                totalPage: res.data.data.total_pages,
                                totalProduct: res.data.data.total_items,
                            })
                        );
                        dispatch(setDataProduct(res.data.data.items));
                    } else {
                        alert("Không thể tải sản phẩm. Vui lòng thử lại!");
                    }
                })
                .catch((error) => {
                    console.error("Lỗi khi gọi API:", error);
                    alert("Lỗi khi gọi API sản phẩm!");
                })
                .finally(() => {
                    dispatch(setLoading(false));
                });
        } catch (e) {
            console.log("Lỗi hệ thống:", e);
            dispatch(setLoading(false));
        }
    }

    function getAllCategory() {
        axios
            .get("http://127.0.0.1:8000/api/categories")
            .then((res) => {
                if (res.data.status === 200) {
                    setLstCategory(res.data.data);
                } else {
                    alert("Cannot load categories, please try again!");
                }
            })
            .catch((error) => {
                console.error("Error in loading categories", error);
            });
    }

    useEffect(() => {
        setTimeout(() => {
            getAllProduct({});
        }, 1000);
        getAllCategory();
    }, []);

    const router = useRouter();

    // ========== Handle Register ==========
    const handleRegister = () => {
        if (!register.name || !register.email || !register.password) {
            toast.warn("Please enter full information!");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(register.email)) {
            toast.warn("Email is not in correct format. Please try again!");
            return;
        }
        axios
            .post("http://127.0.0.1:8000/api/users/register", register)
            .then((res) => {
                if (res.data.status === 201) {
                    const access_token = res.data.token;
                    Cookies.set("token_portal", access_token, { expires: 1 });
                    toast.success("Sign up successfully!");
                    setSelectAuth(true);
                    setLogin({ ...login, email: register.email, password: register.password });
                } else {
                   toast.error("Sign up error, please try again!");
                }
            })
            .catch((error) => {
                console.error("Error in sign up", error);
                toast.error("Email đã tồn tại hoặc có lỗi xảy ra!");
            });
    };

    // ========== Get Cart to set the cart count ==========
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
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // ========== Handle Login ==========
    const handleLogin = async () => {
        if (!login.email || !login.password) {
            toast.warn("Please enter your email and password!");
            return;
        }
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(login.email)) {
            toast.warn("Please enter a valid email address!");
            return;
        }
    
        try {
            dispatch(setLoading(true));
            openModelHandler(false);
    
            const res = await axios.post("http://127.0.0.1:8000/api/auth/login", {
                email: login.email,
                password: login.password,
                role: "Customer",
            });
    
            if (res.data.status === 200) {
                getCart();
                const access_token = res.data.data["access_token"];
                const user = res.data.data;
                dispatch(setUser(user));
                dispatch(setIsLogin(true));
                dispatch(setToken(access_token));
                Cookies.set("token_portal", access_token, { expires: 1 });
                toast.success("Logged in successfully!");
            } else {
                toast.error("Login failed. Please try again!");
            }
        } catch (error: any) {
            if (error.response) {
                const status = error.response.status;
    
                if (status === 401) {
                    toast.error("Incorrect email or password!");
                } else if (status === 422) {
                    toast.error("Invalid input. Please check your credentials.");
                } else {
                    toast.error("An unexpected error occurred. Please try again.");
                }
            } else {
                toast.error("Network error. Please check your connection.");
            }
    
            console.error("Login error:", error);
        } finally {
            dispatch(setLoading(false));
        }
    };
    
    
    

    // ========== Check Auth (on mount) ==========
    useEffect(() => {
        const token = Cookies.get("token_portal") || "";
        if (token && token !== "") {
            axios
                .post(
                    "http://127.0.0.1:8000/api/auth/check-auth",
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .then((response) => {
                    if (response.data.status === 200) {
                        // If needed, handle anything upon verified token.
                    }
                })
                .catch((error) => { });
        }
    }, [router]);

    // ========== Handle Forgot Password ==========
    async function handleForgotPassword() {
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/client/forgot-password", {
                email: forgotEmail,
            });

            if (response.data.status === 200) {
                alert(response.data.message || "OTP đã được gửi đến email của bạn. Vui lòng kiểm tra!");
                setForgotEmail("");
                setOpenForgotModal(false);
            } else {
                alert(response.data.message || "Không thể gửi OTP, vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            alert("Đã xảy ra lỗi khi gửi OTP, vui lòng thử lại!");
        }
    }

    function openResetPasswordModal(email: string) {
        setResetData({ ...resetData, email });
        setOpenResetModal(true);
    }

    function closeResetModalHandler() {
        setOpenResetModal(false);
        setResetData({ email: "", otp: "", newPassword: "" });
    }

    const handleSearch = () => {
        getAllProduct({ pageIndex: 1 });
        dispatch(setSearch(""));
    };

    return (
        <>
            <div className="container">
                <HeaderComponent
                    search={search}
                    onSearch={() => {
                        getAllProduct({ pageIndex: 1 });
                        dispatch(setSearch(""));
                    }}
                    onLogin={() => openModelHandler(true)}
                    onHome={() => {
                        dispatch(setLoading(true));
                        setTimeout(() => {
                            getAllProduct({});
                        }, 1500);
                        setSelectCategory(null);
                        setSelectedProd(null);
                    }}
                    isHome={true}
                    onRegister={() => openModelHandler(false)}
                />
                <div className="body-container">
                    {selectedProd == null && (
                        <div className="body-container-silder">
                            <h2 className="category-heading">Danh mục</h2>
                            <div className="body-silder-menu">
                                <div className="menu-ul">
                                    <span
                                        className="menu-li"
                                        onClick={() => {
                                            getAllProduct({});
                                            setSelectCategory(null);
                                        }}
                                    >
                                        {selectCategory == null ? (
                                            <p className="menu-a">Trang chủ</p>
                                        ) : (
                                            <p className="menu">Trang chủ</p>
                                        )}
                                    </span>

                                    {lstCategory.map((item: any) => {
                                        return (
                                            <span
                                                key={item.id}
                                                className="menu-li"
                                                onClick={() => {
                                                    getAllProduct({ id_category: item.id });
                                                    setSelectCategory(item.id);
                                                }}
                                            >
                                                {selectCategory == item.id ? (
                                                    <p className="menu-a">{item.name}</p>
                                                ) : (
                                                    <p className="menu">{item.name}</p>
                                                )}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="body-container-content">
                        {selectedProd == null ? (
                            <>
                                <div className="Sorting">
                                    <Sorting
                                        onNew={() =>
                                            getAllProduct({
                                                sortOder: "desc",
                                                sort_col: "created_at",
                                                pageIndex: 1,
                                            })
                                        }
                                        onSortPrice={(value) =>
                                            getAllProduct({
                                                sortOder: value.target.value,
                                                sort_col: "price",
                                                pageIndex: 1,
                                            })
                                        }
                                        onTrending={() =>
                                            getAllProduct({
                                                sortOder: "desc",
                                                sort_col: "discount",
                                                pageIndex: 1,
                                            })
                                        }
                                        page={`${total.pageIndex}/${total.totalPage}`}
                                        onNextPage={() => {
                                            if (total.pageIndex < total.totalPage) {
                                                const newPageIndex = total.pageIndex + 1;
                                                getAllProduct({
                                                    id_category: selectCategory ?? undefined,
                                                    pageIndex: newPageIndex,
                                                });
                                            }
                                        }}
                                        onPrevPage={() => {
                                            if (total.pageIndex > 1) {
                                                const newPageIndex = total.pageIndex - 1;
                                                getAllProduct({
                                                    id_category: selectCategory ?? undefined,
                                                    pageIndex: newPageIndex,
                                                });
                                            }
                                        }}
                                    />
                                </div>

                                <div
                                    className="banner-image w-270 h-50"
                                    style={{ marginTop: "20px", marginBottom: "20px" }}
                                >
                                    <Banner />
                                </div>

                                {dataProduct.length > 0 && (
                                    <ProdList
                                        onSelectProduct={(e) => setSelectedProd(e)}
                                        listProduct={dataProduct}
                                        category={lstCategory}
                                    />
                                )}
                            </>
                        ) : (
                            <ProdDetail
                                idProduct={selectedProd["id"]}
                                onBack={() => setSelectedProd(null)}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/*=============================
                MODAL FOR LOGIN/REGISTER
              ==============================*/}
            <div className="modal" style={{ display: openModel ? "flex" : "none" }}>
                <div className="modal-overlay"></div>
                <div className="modal-body">
                    {/* Authen form */}
                    <div className="auth-form">
                        <div className="auth-form-container">
                            {selectAuth ? (
                                <div className="auth-form-header">
                                    <h3
                                        className="auth-form-switch-btn"
                                        onClick={() => {
                                            setSelectAuth(true);
                                        }}
                                    >
                                        Đăng nhập
                                    </h3>
                                    <span
                                        className="auth-form-heading"
                                        onClick={() => {
                                            setSelectAuth(false);
                                        }}
                                    >
                                        Đăng ký
                                    </span>
                                </div>
                            ) : (
                                <div className="auth-form-header">
                                    <h3
                                        className="auth-form-switch-btn"
                                        onClick={() => setSelectAuth(false)}
                                    >
                                        Đăng ký
                                    </h3>
                                    <span
                                        className="auth-form-heading"
                                        onClick={() => {
                                            setSelectAuth(true);
                                        }}
                                    >
                                        Đăng nhập
                                    </span>
                                </div>
                            )}

                            {selectAuth
                                ? formLogin({
                                    email: login.email,
                                    password: login.password,
                                    setEmail: (e) => {
                                        setLogin({ ...login, email: e.target.value });
                                    },
                                    setPassword: (e) => {
                                        setLogin({ ...login, password: e.target.value });
                                    },
                                    openForgotModalHandler: openForgotModalHandler,
                                })
                                : formRegister({
                                    name: register.name,
                                    email: register.email,
                                    password: register.password,
                                    setName: (e) => {
                                        setRegister({ ...register, name: e.target.value });
                                    },
                                    setEmail: (e) => {
                                        setRegister({ ...register, email: e.target.value });
                                    },
                                    setPassword: (e) => {
                                        setRegister({ ...register, password: e.target.value });
                                    },
                                })}

                            <div className="auth-form-aside">
                                <p className="auth-form-policy-text">
                                    Bằng việc đăng ký, bạn đã đồng ý với NRGrunt về
                                    <a href="" className="auth-form-policy-link">
                                        {" "}
                                        Điều khoản dịch vụ
                                    </a>{" "}
                                    &
                                    <a href="" className="auth-form-policy-link">
                                        {" "}
                                        Chính sách bảo mật
                                    </a>
                                </p>
                            </div>

                            <div className="auth-form-controls">
                                {selectAuth ? (
                                    <button className="btn btn-primary" onClick={handleLogin}>
                                        Đăng nhập
                                    </button>
                                ) : (
                                    <button className="btn btn-primary" onClick={handleRegister}>
                                        Đăng ký
                                    </button>
                                )}
                            </div>
                        </div>
                        <i
                            className="cancel-icon fa-solid fa-xmark"
                            onClick={() => openModelHandler(true)}
                        ></i>
                    </div>
                </div>
            </div>
            <ForgotPasswordModal
                isOpen={openForgotModal}
                onClose={() => setOpenForgotModal(false)}
                openLoginModal={() => {
                    setSelectAuth(true);   
                    setOpenModel(true);      
                }}
            />
            {isLoading && <LoadingScreen />}
        </>
    );
}

const formLogin = ({
    
    email,
    password,
    setEmail,
    setPassword,
    openForgotModalHandler,
}: {
    email: string;
    password: string;
    setEmail: (e: ChangeEvent<HTMLInputElement>) => void;
    setPassword: (e: ChangeEvent<HTMLInputElement>) => void;
    openForgotModalHandler: () => void;
}) => {
    return (
        <div className="auth-form-form">
            <div className="auth-form-group">
                <input
                    type="text"
                    className="auth-form-input"
                    placeholder="Email của bạn "
                    defaultValue={email}
                    onChange={setEmail}
                />
            </div>
            <div className="auth-form-group">
                <input
                    type="password"
                    className="auth-form-input"
                    placeholder="Mật khẩu của bạn "
                    defaultValue={password}
                    onChange={setPassword}
                />
            </div>
            <div style={{ textAlign: "right", marginTop: "5px" }}>
                <span
                    style={{ cursor: "pointer", color: "blue", fontSize: "14px" }}
                    onClick={openForgotModalHandler}
                >
                    Quên mật khẩu?
                </span>
            </div>
        </div>
    );
};

const formRegister = ({
    name,
    email,
    password,
    setName,
    setEmail,
    setPassword,
}: {
    name: string;
    email: string;
    password: string;
    setName: (e: ChangeEvent<HTMLInputElement>) => void;
    setEmail: (e: ChangeEvent<HTMLInputElement>) => void;
    setPassword: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
    return (
        <div className="auth-form-register">
            <div className="auth-form-group">
                <input
                    type="text"
                    className="auth-form-input"
                    placeholder="Tên của bạn "
                    value={name}
                    onChange={setName}
                    name="name"
                />
            </div>
            <div className="auth-form-group">
                <input
                    type="text"
                    className="auth-form-input"
                    placeholder="Email của bạn "
                    value={email}
                    onChange={setEmail}
                />
            </div>
            <div className="auth-form-group">
                <input
                    type="password"
                    className="auth-form-input"
                    placeholder="Mật khẩu của bạn "
                    value={password}
                    onChange={setPassword}
                />
            </div>
        </div>
    );
};
