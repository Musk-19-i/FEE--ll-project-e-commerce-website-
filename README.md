# Bazaar — Product Catalogue (Evaluation 1)

A React 18 + Vite storefront front-end covering **product browsing, filtering, sorting,
and product detail** — the Evaluation 1 slice of the full Amazon/Flipkart-clone brief.
Cart, wishlist, checkout, and auth are intentionally out of scope; they land in
Evaluations 2 and 3.

## Stack

- **React 18 + Vite** — app shell and dev server
- **Redux Toolkit** — `products` slice (`createSlice`, `createAsyncThunk`)
- **Reselect** (via `reselect`) — memoised selectors for filtering/sorting/pagination
- **React Router v6** — `/` (listing) and `/product/:id` (detail)
- **Axios** — API layer, isolated in `src/api`
- **Tailwind CSS** — styling, custom design tokens in `tailwind.config.js`
- **DummyJSON** — product data source (`https://dummyjson.com/products`)

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to /dist
```

## Architecture notes

### Why Redux Toolkit now, before there's a cart

The store is scaffolded in Evaluation 1 so the `products` slice's shape, selector
conventions, and async-thunk pattern are already established before `cart` and
`wishlist` slices are added in Evaluation 2. This avoids retrofitting Redux into
a component tree that was built assuming local state.

### Normalised state, derived data via selectors

`productsSlice` stores exactly one copy of the product list (`state.products.items`).
Everything else — the filtered list, the sorted list, the current page, unique brands,
price bounds — is **computed**, not stored, in `src/features/products/productsSelectors.js`
using `reselect`'s `createSelector`. This means:

- No filtered/sorted copies of product data can drift out of sync with the source list.
- Selectors only recompute when their actual inputs change (memoisation), not on every
  render — this is the answer to "where would you memoise, and how do you prove it helped"
  from the interview angle: swap in `console.count` inside a selector body, or check
  React DevTools Profiler, to show a filter/sort selector isn't recomputing on
  unrelated state changes (e.g. typing in an unrelated field).

### Data flow for a filter change

1. User clicks a category / brand / price / rating control.
2. Component dispatches a plain action (`setCategory`, `toggleBrand`, ...).
3. Reducer updates `state.products.filters` and resets `page` to 1.
4. `selectPaginatedProducts` recomputes (items → filters → sort → page, each memoised).
5. Connected components re-render with the new slice of data.

### Async flow

`loadProducts` is a `createAsyncThunk` that fetches the full catalogue and category
list in parallel. It has three lifecycle actions handled in `extraReducers`:
`pending` (sets `status: 'loading'`), `fulfilled` (populates `items`/`categories`),
and `rejected` (captures `error`). The whole catalogue is fetched once
(`limit=0`); pagination is client-side over the already-fetched list, since the
brief's page size (12) is much smaller than the ~194-product dataset.

### Performance

- `ProductCard` is wrapped in `React.memo` since dozens render per page and most
  don't change when a sibling's data does.
- Price-range inputs are local component state until blur, avoiding a store
  dispatch (and full selector recompute) on every keystroke.
- Selector memoisation (above) is the main performance lever for the listing page.

### Swapping the data source

All API calls live in `src/api/productService.js`, on top of a single Axios
instance (`src/api/axiosInstance.js`). Moving to FakeStore, Platzi, or a future
Express + MongoDB backend (Evaluation 3 stretch goal) only touches this folder.

## Folder structure

```
src/
  api/                    Axios instance + product API calls
  app/store.js            Redux store configuration
  features/products/      productsSlice.js, productsSelectors.js
  components/             Header, ProductCard, FilterSidebar, SortDropdown,
                           Pagination, StarRating, Loader, ErrorState
  pages/                  ProductListing, ProductDetail, NotFound
  App.jsx, main.jsx
```

## What's deliberately mocked

- **Variants** (color/storage on the detail page) — DummyJSON has no real variant
  data, so these are illustrative UI only, not wired to price/stock.
- **Cart button** — present on the detail page for layout completeness but disabled
  in intent; wiring it to a `cart` slice is Evaluation 2.
