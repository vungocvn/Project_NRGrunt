// store/provider.tsx
"use client"; // Bắt buộc khi dùng Redux với Next.js (App Router)

import { Provider } from "react-redux";
import { store } from "./store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
