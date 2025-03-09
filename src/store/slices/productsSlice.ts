import { createSlice } from "@reduxjs/toolkit"


export interface Total {
pageIndex: number,
pageSize: number,
totalPage: number,
totalProduct: number
}
interface ProductSlice {
totalProduct: Total,
isLoading: boolean
}
const initialState: ProductSlice = {
    totalProduct: {pageIndex: 1, pageSize: 8, totalPage: 1, totalProduct: 0},
    isLoading: true
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
        }
    }
});
export const {setTotal,setLoading} = productSlice.actions;
export default productSlice.reducer;