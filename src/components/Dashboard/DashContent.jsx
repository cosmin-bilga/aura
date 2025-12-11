import { useEffect, useState } from "react";
import CustomerProfile from "./components/CustomerProfile";
import CustomerHistory from "./components/CustomerHistory";
import CustomerComments from "./components/CustomerComments";
import CustomerFavoriteOffers from "./components/CustomerFavoriteOffers";
import AdminAllOffers from "./components/AdminAllOffers";
import AdminAllProviders from "./components/AdminAllProviders";
import AdminAllCustomers from "./components/AdminAllCustomers";
import ProviderProfile from "./components/ProviderProfile";
import ProviderOffers from "./components/ProviderOffers";

export default function DashContent({ user }) {
  const [activePage, setActivePage] = useState("profil");

  useEffect(() => {
    const updatePage = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) setActivePage(hash);
    };
    updatePage();
    window.addEventListener("hashchange", updatePage);

    return () => window.removeEventListener("hashchange", updatePage);
  }, []);

  return (
    <main
      className="dash-content"
      style={{
        flex: 1,
        padding: "2rem",
        overflowY: "auto",
        backgroundColor: "#fff",
      }}
    >
      <h1>Bienvenue, {user.firstname} !</h1>

      {/* Provider pages */}
      {user.role === "provider" && activePage === "profil" && (
        <ProviderProfile user={user} />
      )}
      {user.role === "provider" && activePage === "mes-offres" && (
        <ProviderOffers user={user} />
      )}

      {/* Customer pages */}
      {user.role === "customer" && activePage === "profil" && (
        <CustomerProfile user={user} />
      )}
      {user.role === "customer" && activePage === "historique" && (
        <CustomerHistory user={user} />
      )}
      {user.role === "customer" && activePage === "commentaires" && (
        <CustomerComments user={user} />
      )}
      {user.role === "customer" && activePage === "offres-favoris" && (
        <CustomerFavoriteOffers user={user} />
      )}

      {/* Admin pages */}
      {user.role === "admin" && activePage === "toutes-les-offres" && (
        <AdminAllOffers />
      )}
      {user.role === "admin" && activePage === "tous-les-prestataires" && (
        <AdminAllProviders />
      )}
      {user.role === "admin" && activePage === "tous-les-clients" && (
        <AdminAllCustomers />
      )}
    </main>
  );
}