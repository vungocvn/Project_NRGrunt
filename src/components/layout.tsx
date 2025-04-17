import HeaderComponent from "@/components/HeaderComponent";
import FooterComponent from "@/components/FooterCom";
export default function Layout({ children }) {
    return (
      <div className="page-wrapper">
        <HeaderComponent />
        <main className="page-content">{children}</main>
        <FooterComponent />
      </div>
    );
  }
  