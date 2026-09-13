import { createSelector } from "reselect";

const selectItems = (state) => state.products.items;
const selectFilters = (state) => state.products.filters;
const selectSort = (state) => state.products.sort;
export const selectPage = (state) => state.products.page;
export const selectPageSize = (state) => state.products.pageSize;
export const selectStatus = (state) => state.products.status;
export const selectError = (state) => state.products.error;
export const selectCategories = (state) => state.products.categories;


export const selectAllBrands = createSelector(selectItems, (items) => {
  const brands = new Set(items.map((p) => p.brand).filter(Boolean));
  return Array.from(brands).sort();
});

export const selectPriceBounds = createSelector(selectItems, (items) => {
  if (items.length === 0) return { min: 0, max: 0 };
  const prices = items.map((p) => p.price);
  return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
});


export const selectFilteredProducts = createSelector(
  selectItems,
  selectFilters,
  (items, filters) => {
    return items.filter((p) => {
      if (filters.category !== "all" && p.category !== filters.category) {
        return false;
      }
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) {
        return false;
      }
      if (filters.minPrice != null && p.price < filters.minPrice) return false;
      if (filters.maxPrice != null && p.price > filters.maxPrice) return false;
      if (filters.minRating > 0 && p.rating < filters.minRating) return false;
      if (
        filters.query &&
        !p.title.toLowerCase().includes(filters.query.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }
);

export const selectSortedProducts = createSelector(
  selectFilteredProducts,
  selectSort,
  (filtered, sort) => {
    const list = [...filtered];
    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "rating-desc":
        return list.sort((a, b) => b.rating - a.rating);
      case "newest":
        return list.sort((a, b) => b.id - a.id);
      default:
        return list; 
    }
  }
);

export const selectResultCount = createSelector(
  selectSortedProducts,
  (list) => list.length
);

export const selectTotalPages = createSelector(
  selectResultCount,
  selectPageSize,
  (count, pageSize) => Math.max(1, Math.ceil(count / pageSize))
);

export const selectPaginatedProducts = createSelector(
  selectSortedProducts,
  selectPage,
  selectPageSize,
  (sorted, page, pageSize) => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }
);
