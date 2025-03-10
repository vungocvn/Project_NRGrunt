import { createSlice } from "@reduxjs/toolkit"


export interface Total {
pageIndex: number,
pageSize: number,
totalPage: number,
totalProduct: number
}
interface ProductSlice {
totalProduct: Total,
isLoading: boolean,
dataProduct: any[]
}
const initialState: ProductSlice = {
    totalProduct: {pageIndex: 1, pageSize: 8, totalPage: 1, totalProduct: 0},
    isLoading: true,
    dataProduct: [],
}
const productSlice = createSlice({
    name: "product",    
    initialState: initialState,
    reducers:{
        setTotal : (state:any, action) => {
            state.totalProduct = action.payload
        },
        setLoading: (state:any, action) => {
            state.isLoading = action.payload
        },
        setDataProduct: (state:any, action) => {
            state.dataProduct = action.payload  
        }
    }
});
export const {setTotal,setLoading,setDataProduct} = productSlice.actions;
export default productSlice.reducer;