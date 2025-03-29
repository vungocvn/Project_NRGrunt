import axios from "axios";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {useEffect} from "react";

type Props = {

};

export default function OrderDetails(props: Props) {
    const {token} = useSelector((state: RootState) =>({
        token: state.auth.token,
    }))
    async  function  getCartById (id: number)  {
        try {
           await  axios.get(`http://127.0.0.1:8000/api/carts/${id}`,{
               headers:{
                   Authorization: `Bearer ${token}`
               }
           }).then(({data}) => {
               console.log(data,'success');
           }).then((e)=>{}).catch((e)=> console.log(e));
        }catch(e) {

        }
    }
    useEffect(()=>{
        getCartById(4);
    },[])
    return (
        <div>
            <p>Order Details</p>
        </div>
    );
};