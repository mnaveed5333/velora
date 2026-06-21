"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { fetchCurrentUser } from "./slices/authSlice";
import { hydrateCart } from "./slices/cartSlice";
import { loadCartFromStorage, saveCartToStorage } from "@/lib/cartStorage";

function AuthInitializer({ children }) {
  useEffect(() => {
    store.dispatch(fetchCurrentUser());
  }, []);
  return children;
}

function CartInitializer({ children }) {
  useEffect(() => {
    // Load whatever was saved last time, once, on first mount.
    const savedItems = loadCartFromStorage();
    if (savedItems.length > 0) {
      store.dispatch(hydrateCart(savedItems));
    }

    // Keep localStorage in sync with every cart change from here on.
    const unsubscribe = store.subscribe(() => {
      saveCartToStorage(store.getState().cart.items);
    });

    return unsubscribe;
  }, []);
  return children;
}

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <CartInitializer>{children}</CartInitializer>
      </AuthInitializer>
    </Provider>
  );
}