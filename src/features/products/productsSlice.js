import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllProducts, fetchCategories } from "../../api/productService";

const PAGE_SIZE = 12;

export const loadProducts = createAsyncThunk(
  "products/loadProducts",
  async () => {
    const [products, categories] = await Promise.all([
      fetchAllProducts(),
      fetchCategories(),
    ]);
    return { products, categories };
  }
);

const initialFilters = {
  category: "all",
  brands: [],
  minPrice: null,
  maxPrice: null,
  minRating: 0,
  query: "",
};

const initialState = {
  // Normalised: the raw product list lives here once, keyed nowhere else.
  // Every other piece of derived data (filtered list, totals, price bounds)
  // is computed by a selector instead of being duplicated in state.
  items: [],
  categories: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  filters: initialFilters,
  sort: "featured", // 'featured' | 'price-asc' | 'price-desc' | 'rating-desc' | 'newest'
  page: 1,
  pageSize: PAGE_SIZE,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setCategory(state, action) {
      state.filters.category = action.payload;
      state.page = 1;
    },
    toggleBrand(state, action) {
      const brand = action.payload;
      state.filters.brands = state.filters.brands.includes(brand)
        ? state.filters.brands.filter((b) => b !== brand)
        : [...state.filters.brands, brand];
      state.page = 1;
    },
    setPriceRange(state, action) {
      const { min, max } = action.payload;
      state.filters.minPrice = min;
      state.filters.maxPrice = max;
      state.page = 1;
    },
    setMinRating(state, action) {
      state.filters.minRating = action.payload;
      state.page = 1;
    },
    setQuery(state, action) {
      state.filters.query = action.payload;
      state.page = 1;
    },
    resetFilters(state) {
      state.filters = initialFilters;
      state.page = 1;
    },
    setSort(state, action) {
      state.sort = action.payload;
      state.page = 1;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.products;
        state.categories = action.payload.categories;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load products";
      });
  },
});

export const {
  setCategory,
  toggleBrand,
  setPriceRange,
  setMinRating,
  setQuery,
  resetFilters,
  setSort,
  setPage,
} = productsSlice.actions;

export default productsSlice.reducer;
