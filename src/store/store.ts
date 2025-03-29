// store/store.ts
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import productSlice from "./slices/productsSlice";
import  {thunk } from "redux-thunk";
import logger from "redux-logger";
import storage from 'redux-persist/lib/storage'; // Sử dụng localStorage
import { persistReducer, persistStore } from "redux-persist";

// Cấu hình persist cho Redux Persist
const persistConfig = {
    key: "root",
    storage, // Lưu vào localStorage
    whitelist: ["auth"], // Chỉ lưu các state cần thiết
};
const rootReducer = combineReducers({
  auth: authSlice,
  product: productSlice
});

// Tạo reducer có persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Cấu hình store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Tắt cảnh báo về Redux Persist
        }).concat(thunk, logger),
});

// Tạo persist store
export const persistor = persistStore(store);
// Export RootState và AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
