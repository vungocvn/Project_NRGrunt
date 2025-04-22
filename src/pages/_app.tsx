import "@/styles/shop.css";
import "@/styles/detail.css";
import "@/styles/cart.css";
import "@/styles/color.css";
import "@/styles/reponsive.css";
import "@/styles/invoice.css";
import "@/styles/globals.css";
import "@/styles/forgot.css";
import "@/styles/history.css";
import "@/styles/logout.css";
import type { AppProps } from "next/app";
import { ReduxProvider } from "@/store/provider";
import  { FooterComponents } from "@/components/FooterCom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isHomePage = router.pathname === "/"; 

  return (
    <ReduxProvider>
      <div className="layout-wrapper">
        {/* Nội dung chính */}
        <div className={isHomePage ? "" : "layout-content-with-margin"}>
          <Component {...pageProps} />
        </div>

        <ToastContainer />
        <FooterComponents />
      </div>
    </ReduxProvider>
  );
} 