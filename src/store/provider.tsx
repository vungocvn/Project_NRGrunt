// store/provider.tsx
"use client"; // Bắt buộc khi dùng Redux với Next.js (App Router)

import { Provider } from "react-redux";
import {persistor, store} from "./store";
import { PersistGate } from "redux-persist/integration/react";
import React from "react";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      {children}
    </PersistGate>
  </Provider>;
}
