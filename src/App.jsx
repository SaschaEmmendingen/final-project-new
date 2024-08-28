import './index.css'; // Tailwind
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Fernseher from './components/Fernseher';
import GamingPC from './components/GamingPC';
import Handys from './components/Handys';
import Home from './components/Home';
import Laptops from './components/Laptops';
import Kontakt from './components/Kontakt'; // Importiere Kontakt
import Konto from './components/Konto'; // Importiere Konto
import Warenkorb from './components/Warenkorb'; // Importiere Warenkorb
import PageNotFound from './components/PageNotFound';
import Parent from './components/Parent';
import { CartProvider } from './components/CartContext'; // Importiere CartProvider damit wir wrappen können
import Login from "./components/Main/Login";
import UserDashboard from "./components/User/UserDashboard";
import AdminDashboard from "./components/Admin/AdminDashboard";
import ProductDetail from "./components/Order/ProductDetail";

function App() {
  return (
    <CartProvider>  {/* Umgibt die gesamte App mit dem CartProvider für den Warenkorb*/}
      <div className="flex flex-col min-h-screen">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Parent />}>
              <Route index element={<Home />} />
              <Route path="Fernseher" element={<Fernseher />} />
              <Route path="GamingPC" element={<GamingPC />} />
              <Route path="Handys" element={<Handys />} />
              <Route path="Laptops" element={<Laptops />} />
              <Route path="kontakt" element={<Kontakt />} />
              <Route path="konto" element={<Konto />} />
              <Route path="/warenkorb" element={<Warenkorb />} />
              <Route path="*" element={<PageNotFound />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/products/:id" element={<ProductDetail />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </CartProvider>  
  );
}

export default App;
