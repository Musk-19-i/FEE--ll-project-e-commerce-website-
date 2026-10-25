import { createSlice } from "@reduxjs/toolkit";

// Holds only the most recently placed order (for the success page).
// The cart itself lives in the cart slice.
const checkoutSlice = createSlice({
  name: "checkout",
  initialState: { lastOrder: null },
  reducers: {
    placeOrder(state, action) {
      state.lastOrder = action.payload;
    },
  },
});

export const { placeOrder } = checkoutSlice.actions;
export default checkoutSlice.reducer;