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
import {FooterComponents} from "@/components/FooterComponents";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider>
      <div className="layout-wrapper">
        <Component {...pageProps} />
        <ToastContainer />
        <FooterComponents />
      </div>
    </ReduxProvider>
  );
}

