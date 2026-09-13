import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <Routes>
        <Route path="/" element={<ProductListing />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
