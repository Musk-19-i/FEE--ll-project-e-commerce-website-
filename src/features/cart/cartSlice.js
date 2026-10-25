import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    // payload: { id, title, thumbnail, price, stock }
    addToCart(state, action) {
      const p = action.payload;
      const existing = state.items.find((i) => i.id === p.id);
      if (existing) {
        if (existing.qty < existing.stock) existing.qty += 1;
      } else {
        state.items.push({ ...p, qty: 1 });
      }
    },
    increaseQty(state, action) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.qty < item.stock) item.qty += 1;
    },
    decreaseQty(state, action) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.qty > 1) item.qty -= 1;
    },
    removeItem(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, increaseQty, decreaseQty, removeItem, clearCart } =
  cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.qty, 0);
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);

export default cartSlice.reducer;