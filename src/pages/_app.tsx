import "@/styles/shop.css";
import "@/styles/detail.css";
import "@/styles/cart.css";
import "@/styles/color.css";
import "@/styles/reponsive.css";
import "@/styles/invoice.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ReduxProvider } from "@/store/provider";
import {FooterComponents} from "@/components/FooterComponents";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider>
      <Component {...pageProps} />
        <FooterComponents />
    </ReduxProvider>
  );
}
