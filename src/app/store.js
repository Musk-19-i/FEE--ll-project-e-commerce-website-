import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../features/products/productsSlice";
import cartReducer from "../features/cart/cartSlice";
import checkoutReducer from "../features/checkout/checkoutSlice";

const CART_KEY = "bazaar_cart";

// Read the saved cart so it survives a page refresh
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
  },
  preloadedState: { cart: { items: loadCart() } },
});

// Save the cart whenever it changes
store.subscribe(() => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(store.getState().cart.items));
  } catch {
    // storage unavailable (private mode etc.), cart just won't persist
  }
});