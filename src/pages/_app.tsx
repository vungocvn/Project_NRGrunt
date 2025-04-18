import "@/styles/shop.css";
import "@/styles/detail.css";
import "@/styles/cart.css";
import "@/styles/color.css";
import "@/styles/reponsive.css";
import "@/styles/invoice.css";
import "@/styles/globals.css";
import "@/styles/forgot.css";
import "@/styles/history.css";

import type { AppProps } from "next/app";
import { ReduxProvider } from "@/store/provider";
import { FooterComponents } from "@/components/FooterCom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isHomePage = router.pathname === "/";

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          Cookies.remove("token_portal"); 
          toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
          router.push("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor); 
    };
  }, [router]);

  return (
    <ReduxProvider>
      <div className="layout-wrapper">
        <div className={isHomePage ? "" : "layout-content-with-margin"}>
          <Component {...pageProps} />
        </div>
        <ToastContainer
          position="top-right"
          autoClose={2500}
          limit={3}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
        <FooterComponents />
      </div>
    </ReduxProvider>
  );
}
