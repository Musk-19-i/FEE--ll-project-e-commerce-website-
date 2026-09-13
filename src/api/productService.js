import axiosInstance from "./axiosInstance";


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
  
  return data.map((c) => (typeof c === "string" ? c : c.slug));
}
