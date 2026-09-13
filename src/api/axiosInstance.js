import axios from "axios";

// DummyJSON is used as the product data source for this evaluation.
// Swapping to a different API (FakeStore, Platzi, or a future Express backend)
// only requires changes inside src/api — nothing else in the app touches this URL.
const axiosInstance = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 10000,
});

export default axiosInstance;
