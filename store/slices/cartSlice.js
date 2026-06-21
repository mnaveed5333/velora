import { createSlice } from "@reduxjs/toolkit";

// Build a stable identity for a cart line: same product + same color + same
// size merges into one line and bumps quantity. Different color/size on the
// same product is treated as a separate line.
function getLineKey(item) {
  return [item.productId, item.color || "", item.size || ""].join("::");
}

const initialState = {
  items: [], // { lineKey, productId, slug, name, image, price, color, size, quantity }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Replaces the entire cart — used once on app load to hydrate from localStorage.
    hydrateCart(state, action) {
      state.items = action.payload || [];
    },

    addToCart(state, action) {
      const { productId, slug, name, image, price, color, size, quantity = 1 } =
        action.payload;
      const lineKey = getLineKey({ productId, color, size });
      const existing = state.items.find((i) => i.lineKey === lineKey);

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({
          lineKey,
          productId,
          slug,
          name,
          image,
          price,
          color: color || null,
          size: size || null,
          quantity,
        });
      }
    },

    removeFromCart(state, action) {
      const lineKey = action.payload;
      state.items = state.items.filter((i) => i.lineKey !== lineKey);
    },

    updateQuantity(state, action) {
      const { lineKey, quantity } = action.payload;
      const item = state.items.find((i) => i.lineKey === lineKey);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
    },

    clearCart(state) {
      state.items = [];
    },
  },
});

export const { hydrateCart, addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;