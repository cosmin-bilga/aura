import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Error from "./pages/Error/Error";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import CategoryOffers from "./pages/CategoryOffers/CategoryOffers";
import OfferDetail from "./pages/OfferDetail/OfferDetail";
import DashboardClient from "./pages/DashboardClient/DashboardClient";
import DashboardProvider from "./pages/DashboardProvider/DashboardProvider";
import DashboardAdmin from "./pages/DashboardAdmin/DashboardAdmin";
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

            {/* Dashboards */}
            <Route path="/client/dashboard" element={<DashboardClient />} />
            <Route
              path="/prestataire/dashboard"
              element={<DashboardProvider />}
            />
            <Route path="/admin/dashboard" element={<DashboardAdmin />} />

            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
