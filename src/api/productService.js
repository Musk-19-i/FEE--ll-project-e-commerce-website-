import axiosInstance from "./axiosInstance";

// Fetch the full catalogue once. DummyJSON caps a normal request at 100 items,
// so limit=0 is required to get every product for client-side filter/sort/paginate.
export async function fetchAllProducts() {
  const { data } = await axiosInstance.get("/products", {
    params: { limit: 0 },
  });
  return data.products;
}

export async function fetchProductById(id) {
  const { data } = await axiosInstance.get(`/products/${id}`);
  return data;
}

export async function fetchCategories() {
  const { data } = await axiosInstance.get("/products/categories");
  // API returns objects like { slug, name, url } on recent versions
  return data.map((c) => (typeof c === "string" ? c : c.slug));
}
