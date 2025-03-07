"use client"
import axios from "axios";
import { useRouter } from "next/router";
import ProdDetail from "./Productdetails"
import ProdList from "./ProductList"
import { ChangeEvent, useEffect, useState } from "react"
import HeaderComponent from "./HeaderComponent"
import { getAllProd } from "../pages/api/api"
import Cookies from "js-cookie";
import Banner from "@/components/banner";
import {Sorting} from "@/components/sorting";

export default function Shop() {
    const [selectedProd, setSelectedProd] = useState(null)
    const [openModel, setOpenModel] = useState(false)
    const [selectAuth, setSelectAuth] = useState(true)
    const [selectCategory, setSelectCategory] = useState(null);
    const [lstProduct, setLstProduct] = useState<any>([])
    const [user, setUser] = useState("")
    const [lstCategory, setLstCategory] = useState<any>([])
    const [register, setRegister] = useState({ name: "", email: "", password: "" })
    const [login, setLogin] = useState({ email: "", password: "", role: "Customer" })
    function openModelHandler(element: boolean) {
        if (!openModel) {
            setSelectAuth(element)
            setOpenModel(true)
        } else {
            setOpenModel(false)
        }
    }
    function getAllProduct({id_category,sortOder,sort_col}:{id_category?: number,sortOder?:string,sort_col?:string}) {
        setLstProduct([])
        axios.get("http://127.0.0.1:8000/api/products", { params: { page: 1, page_size: 100, id_category: id_category,sort_order:sortOder,sort_col } })
            .then((res) => {
                if (res.data.status === 200) {
                    setLstProduct(res.data.data.items)
                } else {
                    alert("Sign up error, please try again!")
                }
            })
            .catch((error) => {
                alert("Sign up error, please try again!")
            });
    }

    function getAllCategory() {

        axios.get("http://127.0.0.1:8000/api/categories")
            .then((res) => {
                if (res.data.status === 200) {
                    console.log(res.data.data)
                    setLstCategory(res.data.data)
                } else {
                    alert("Sign up error, please try again!")
                }
            })
            .catch((error) => {
                console.error("Error in sign up", error);
            });
    }
    useEffect(() => {
        getAllProduct({})
        getAllCategory()
    }, [])

    const router = useRouter();

    const handleRegister = () => {
        axios.post("http://127.0.0.1:8000/api/users/register", register)
            .then((res) => {
                if (res.data.status === 201) {
                    const access_token = res.data.token;
                    Cookies.set('token_cua_Ngoc', access_token, { expires: 1 });
                    alert("Sign up successfully!")
                    setSelectAuth(true)
                    setLogin({ ...login, email: register.email, password: register.password })
                } else {
                    alert("Sign up error, please try again!")
                }
            })
            .catch((error) => {
                console.error("Error in sign up", error);
            });
    }
    const handleLogin = () => {
        console.log(login)
        axios.post("http://127.0.0.1:8000/api/auth/login", { email: login.email, password: login.password, role: "Customer" })
            .then((res) => {
                if (res.data.status === 200) {
                    const access_token = res.data.data['access_token'];
                    Cookies.set('token_cua_Ngoc', access_token, { expires: 1 });
                    alert("Sign up successfully!")
                    setUser(login.email)
                    openModelHandler(true)
                } else {
                    alert("Sign up error, please try again!")
                }
            })
            .catch((error) => {
                console.error("Error in sign up", error);
            });
    }

    useEffect(() => {
        const token = Cookies.get('token_cua_Ngoc') || "";

        if (token && token !== "") {
            axios.post("http://127.0.0.1:8000/api/auth/check-auth", {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    if (response.data.status === 200) {
                        
                    }
                })
                .catch(error => {
                    
                });
        }
    }, [router]);
    return (
        <>
            <div className="container">
                <HeaderComponent onLogin={() => openModelHandler(true)} 
                onHome={() =>setSelectedProd(null)}
                isHome={true}
                    onRegister={() => openModelHandler(false)} isLogin={user != "" ? true : false} fullName={user} />
                <div className="body-container">
                    <div className="body-container-silder">
                        <h2 className="category-heading ">
                            Danh mục</h2>
                        <div className="body-silder-menu">
                            <div className="menu-ul">
                                <span className="menu-li" onClick={() => {
                                    getAllProduct({})
                                    setSelectCategory(null)
                                }}>
                                    {selectCategory == null ? <p className="menu-a">Trang chủ</p> : <p className="menu">Trang chủ</p>}
                                </span >

                                {lstCategory.map((item: any) => {
                                    return (
                                        <span className="menu-li" onClick={() => {
                                            getAllProduct({ id_category: item.id })
                                            setSelectCategory(item.id)
                                        }}>

                                            {selectCategory == item.id ? <p className="menu-a">{item.name}</p> : <p className="menu">{item.name}</p>}
                                        </span>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="body-container-content">
                        <div className="Sorting">
                            <Sorting onNew={() => getAllProduct({sortOder: "desc",sort_col: "created_at"})}
                                onSortPrice={(value)=> getAllProduct({sortOder: value.target.value,sort_col: "price"})}
                                onTrending={() => getAllProduct({sortOder: "desc",sort_col: "discount"})}
                                />
                        </div>
                        <div className="banner-image w-270 h-50" style={{marginTop: "20px", marginBottom: "20px"}}>
                            <Banner/>
                        </div>
                        {selectedProd == null ? (
                            lstProduct.length > 0 && (
                                <ProdList onSelectProduct={(e) => {
                                    setSelectedProd(e)
                                }}
                                    listProduct={lstProduct}
                                    category={lstCategory}

                                />
                            )


                        ) : (
                            <ProdDetail  idProduct={selectedProd['id']} onBack={() => setSelectedProd(null)} />
                        )
                        }
                    </div>
                </div>
                <div className="footer">
                    <div className="gird">
                        <div className="gird-row">
                            <div className="gird-column-2-4">
                                <h3 className="footer-heading">Chăm sóc khách hàng</h3>
                                <ul className="footer-list">
                                    <li className="footer-list-item">
                                        <a href="" className="footer-list-item-link">Trung tâm trợ giúp</a>
                                    </li>
                                    <li className="footer-list-item">
                                        <a href="" className="footer-list-item-link">Shop NRGrunt Mall</a>
                                    </li>
                                    <li className="footer-list-item">
                                        <a href="" className="footer-list-item-link">Hướng dẫn mua hàng</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="gird-column-2-4">
                                <h3 className="footer-heading">Giới thiệu</h3>
                                <ul className="footer-list">
                                    <li className="footer-list-item">
                                        <a href="" className="footer-list-item-link">Giới thiệu</a>
                                    </li>
                                    <li className="footer-list-item">
                                        <a href="" className="footer-list-item-link">Tuyển dụng</a>
                                    </li>
                                    <li className="footer-list-item">
                                        <a href="" className="footer-list-item-link">Điều khoản</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="gird-column-2-4">
                                <h3 className="footer-heading">Danh mục</h3>
                                <ul className="footer-list">
                                    <li className="footer-list-item">
                                        <a href="" className="footer-list-item-link">Sữa rửa mặt</a>
                                    </li>
                                    <li className="footer-list-item">
                                        <a href="" className="footer-list-item-link">Đồ dưỡng da</a>
                                    </li>
                                    <li className="footer-list-item">
                                        <a href="" className="footer-list-item-link">Sữa tắm</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="gird-column-2-4">
                                <h3 className="footer-heading">Theo dõi</h3>
                                <ul className="footer-list">
                                    <li className="footer-list-item">
                                        <a href="" className="footer-list-item-link">
                                            <i className="fa-brands fa-facebook"></i>
                                            Facebook</a>
                                    </li>
                                    <li className="footer-list-item">
                                        <a href="" className="footer-list-item-link">
                                            <i className="fa-brands fa-instagram"></i>
                                            Instagram</a>
                                    </li>
                                    <li className="footer-list-item">
                                        <a href="" className="footer-list-item-link">
                                            <i className="fa-brands fa-linkedin"></i>Linkedin</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="gird-column-2-4">
                                <h3 className="footer-heading">Vào cửa hàng trên ứng dụng</h3>
                                <div className="footer-download">
                                    <img src="https://down-vn.img.susercontent.com/file/a5e589e8e118e937dc660f224b9a1472" alt="download qr" className="footer-download-qr" />
                                    <div className="footer-download-app">
                                        <img src="https://st.download.com.vn/data/image/2022/08/02/Google-Play-Store-anh-lon.jpg" alt="" className="footer-download-app-img" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png" alt="" className="footer-download-app-img" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="gird-row-below">
                        <p className="footer-text">© 2025 - Bản quyền thuộc về công ty Ngọc Vũ</p>
                    </div>
                </div>
            </div>

            {/* form login */}
            <div className="modal" style={{ display: openModel ? 'flex' : 'none' }}>
                <div className="modal-overlay"></div>

                <div className="modal-body">

                    {/* Authen form */}
                    <div className="auth-form">
                        <div className="auth-form-container">
                            {selectAuth ? (<div className="auth-form-header">
                                <h3 className="auth-form-switch-btn" onClick={() => { setSelectAuth(true) }}>Đăng nhập</h3>
                                <span className="auth-form-heading" onClick={() => { setSelectAuth(false) }}>Đăng ký</span>
                            </div>) : (<div className="auth-form-header">
                                <h3 className="auth-form-switch-btn" onClick={() => setSelectAuth(false)}>Đăng ký</h3>
                                <span className="auth-form-heading" onClick={() => { setSelectAuth(true) }}>Đăng nhập</span>
                            </div>)}


                            {selectAuth ? formLogin(
                                {
                                    email: register.email, password: register.password,
                                    setEmail: (e) => { setLogin({ ...login, email: e.target.value }) }, setPassword: (e) => { setLogin({ ...login, password: e.target.value }) }
                                }
                            ) : formRegister(
                                {
                                    name: register.name, email: register.email, password: register.password
                                    , setName: (e) => { setRegister({ ...register, name: e.target.value }) }, setEmail: (e) => { setRegister({ ...register, email: e.target.value }) }, setPassword: (e) => { setRegister({ ...register, password: e.target.value }) }
                                }
                            )}
                            <div className="auth-form-aside">
                                <p className="auth-form-policy-text">
                                    Bằng việc đăng ký, bạn đã đồng ý với NRGrunt về
                                    <a href="" className="auth-form-policy-link"> Điều khoản dịch vụ</a> &
                                    <a href="" className="auth-form-policy-link"> Chính sách bảo mật</a>
                                </p>
                            </div>

                            <div className="auth-form-controls">
                                {selectAuth ? <button className="btn btn-primary" onClick={handleLogin}>Đăng nhập</button> :
                                    <button className="btn btn-primary" onClick={handleRegister}>Đăng ký</button>}

                            </div>
                        </div>
                        <i className="cancel-icon fa-solid fa-xmark" onClick={() => openModelHandler(true)}></i>
                    </div>

                </div>

            </div>


        </>
    )
}
const formLogin = ({ email, password, setEmail, setPassword }: { email: string, password: string, setEmail: (e: ChangeEvent<HTMLInputElement>) => void, setPassword: (e: ChangeEvent<HTMLInputElement>) => void }) => {

    return (
        <div className="auth-form-form">
            <div className="auth-form-group">
                <input type="text" className="auth-form-input" placeholder="Email của bạn " defaultValue={email} onChange={setEmail} />
            </div>
            <div className="auth-form-group">
                <input type="password" className="auth-form-input" placeholder="Mật khẩu của bạn " defaultValue={password} onChange={setPassword} />
            </div>
        </div>
    )
};
const formRegister = ({ name, email, password, setName, setEmail, setPassword }: { name: string, email: string, password: string, setName: (e: ChangeEvent<HTMLInputElement>) => void, setEmail: (e: ChangeEvent<HTMLInputElement>) => void, setPassword: (e: ChangeEvent<HTMLInputElement>) => void }) => {

    return (
        <div className="auth-form-register">
            <div className="auth-form-group">
                <input type="text" className="auth-form-input" placeholder="Tên của bạn "
                    value={name} onChange={setName} name="name" />
            </div>
            <div className="auth-form-group">
                <input type="text" className="auth-form-input" placeholder="Email của bạn "
                    value={email} onChange={setEmail} />
            </div>
            <div className="auth-form-group">
                <input type="password" className="auth-form-input" placeholder="Mật khẩu của bạn "
                    value={password} onChange={setPassword} />
            </div>
        </div>

    )
};