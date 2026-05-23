import { BrowserRouter } from "react-router-dom";
import AppRoutes from "@/routes/index";
import CartMergeSync from "@/features/cart/logic/CartMergeSync";

export default function App() {
  return (
    <BrowserRouter>
      <CartMergeSync />
      <AppRoutes />
    </BrowserRouter>
  );
}
