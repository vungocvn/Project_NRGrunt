import Cart from "@/components/cart";
import Footer from "@/components/footer";
import HeaderComponent from "@/components/HeaderComponent";
export default function Category() {
    return (
        <div className="container">
             <HeaderComponent />   
            <Cart onBack={function(product: any): void {
                throw new Error("Function not implemented.");
            } } />
        </div>
    )
}