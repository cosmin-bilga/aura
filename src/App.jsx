import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Contact from "./pages/Contact/Contact";
import Register from "./pages/Register/Register";
import Error from "./pages/Error/Error";
import Legal from "./pages/Legal/Legal";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import CategoryOffers from "./pages/CategoryOffers/CategoryOffers";
import OfferDetail from "./pages/OfferDetail/OfferDetail";
import Dashboard from "./pages/Dashboard/Dashboard";
import ServiceCatalog from "./pages/ServiceCatalog/ServiceCatalog";
import "./styles/main.css";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Layout principal */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/offre" element={<ServiceCatalog />} />

            {/* Catégories */}
            <Route path="/categorie/:categoryKey" element={<CategoryPage />} />
            <Route
              path="/categorie/:categoryKey/offres"
              element={<CategoryOffers />}
            />

            {/* Formulaire d'inscription */}
            <Route path="/inscription" element={<Register />} />

            {/* Détail d’une offre */}
            <Route path="/offred/:id" element={<OfferDetail />} />

            <Route path="/Legal" element={<Legal />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard/:role/:page?" element={<Dashboard />} />

            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
