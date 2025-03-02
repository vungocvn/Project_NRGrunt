import "@/styles/shop.css"
import "@/styles/detail.css"
import "@/styles/cart.css"
import "@/styles/color.css"
import "@/styles/reponsive.css"
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
