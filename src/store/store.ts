// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import productSlice from "./slices/productsSlice";
export const store = configureStore({
  reducer: {
    auth: authSlice, // Định nghĩa reducer
    product: productSlice
  },
});

// Export RootState và AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
