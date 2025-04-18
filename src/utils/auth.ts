import Cookies from "js-cookie";
import { AppDispatch } from "@/store/store";
import { setIsLogin, setToken, setUser } from "@/store/slices/authSlice";
import { setCount } from "@/store/slices/productsSlice";
import router from "next/router";
export function logoutPortal(dispatch: AppDispatch, message = "Bạn đã đăng xuất") {
  Cookies.remove("token_portal");

  dispatch(setIsLogin(false));
  dispatch(setUser(null));
  dispatch(setToken(""));
  dispatch(setCount(0));

  router.push("/shop").then(() => {
    console.log(message);
  });
}
