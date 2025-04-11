import * as React from 'react';
type Props = {

};

export function FooterComponents(props: Props) {
    return (
        <div className="container">
            <div className="footer">
                <div className="gird">
                    <div className="gird-row">
                        <div className="gird-column-2-4">
                            <h3 className="footer-heading">Chăm sóc khách hàng</h3>
                            <ul className="footer-list">
                                <li className="footer-list-item">
                                    <a href="" className="footer-list-item-link">
                                        Trung tâm trợ giúp
                                    </a>
                                </li>
                                <li className="footer-list-item">
                                    <a href="" className="footer-list-item-link">
                                        Shop NRGrunt Mall
                                    </a>
                                </li>
                                <li className="footer-list-item">
                                    <a href="" className="footer-list-item-link">
                                        Hướng dẫn mua hàng
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="gird-column-2-4">
                            <h3 className="footer-heading">Giới thiệu</h3>
                            <ul className="footer-list">
                                <li className="footer-list-item">
                                    <a href="" className="footer-list-item-link">
                                        Giới thiệu
                                    </a>
                                </li>
                                <li className="footer-list-item">
                                    <a href="" className="footer-list-item-link">
                                        Tuyển dụng
                                    </a>
                                </li>
                                <li className="footer-list-item">
                                    <a href="" className="footer-list-item-link">
                                        Điều khoản
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="gird-column-2-4">
                            <h3 className="footer-heading">Danh mục</h3>
                            <ul className="footer-list">
                                <li className="footer-list-item">
                                    <a href="" className="footer-list-item-link">
                                        Sữa rửa mặt
                                    </a>
                                </li>
                                <li className="footer-list-item">
                                    <a href="" className="footer-list-item-link">
                                        Đồ dưỡng da
                                    </a>
                                </li>
                                <li className="footer-list-item">
                                    <a href="" className="footer-list-item-link">
                                        Sữa tắm
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="gird-column-2-4">
                            <h3 className="footer-heading">Theo dõi</h3>
                            <ul className="footer-list">
                                <li className="footer-list-item">
                                    <a href="" className="footer-list-item-link">
                                        <i className="fa-brands fa-facebook"></i>
                                        Facebook
                                    </a>
                                </li>
                                <li className="footer-list-item">
                                    <a href="" className="footer-list-item-link">
                                        <i className="fa-brands fa-instagram"></i>
                                        Instagram
                                    </a>
                                </li>
                                <li className="footer-list-item">
                                    <a href="" className="footer-list-item-link">
                                        <i className="fa-brands fa-linkedin"></i>Linkedin
                                    </a>
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

    );
};