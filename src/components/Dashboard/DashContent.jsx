import { useEffect, useState } from "react";
import Profile from "./components/Profile";
import History from "./components/History";
import Comments from "./components/Comments";
import FavoriteOffers from "./components/FavoriteOffers";
import AllOffers from "./AllOffers";
import AllProviders from "./AllProviders";
import AllCustomers from "./AllCustomers";
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
    <main className="dash-content">
      <header className="dash-section__header dash-section__header--split">
        <div>
          <p className="dash-section__hint">Tableau de bord</p>
          <h1>Bienvenue, {user.firstname} !</h1>
        </div>
        <div className="dash-chip">
          <div className="dash-avatar">
            {(user.firstname?.[0] || "U").toUpperCase()}
            {(user.name?.[0] || "N").toUpperCase()}
          </div>
          <div>
            <p className="dash-chip__name">
              {user.firstname} {user.name}
            </p>
            <p className="dash-chip__role">{user.role}</p>
          </div>
        </div>
      </header>

      {/* Customer */}
      {user.role === "customer" && activePage === "profil" && (
        <section className="dash-section">
          <Profile user={user} />
        </section>
      )}
      {user.role === "customer" && activePage === "historique" && (
        <section className="dash-section">
          <History user={user} />
        </section>
      )}
      {user.role === "customer" && activePage === "commentaires" && (
        <section className="dash-section">
          <Comments user={user} />
        </section>
      )}
      {user.role === "customer" && activePage === "offres-favoris" && (
        <section className="dash-section">
          <FavoriteOffers user={user} />
        </section>
      )}

      {/* Provider */}
      {user.role === "provider" && activePage === "profil" && (
        <section className="dash-section">
          <ProviderProfile user={user} />
        </section>
      )}
      {user.role === "provider" && activePage === "mes-offres" && (
        <section className="dash-section">
          <ProviderOffers user={user} />
        </section>
      )}
      {user.role === "provider" && activePage === "mes-rdv" && (
        <section className="dash-section">
          <p className="dash-section__hint">
            Vos rendez-vous seront bientôt disponibles ici.
          </p>
        </section>
      )}

      {/* Admin */}
      {user.role === "admin" && activePage === "toutes-les-offres" && (
        <section className="dash-section">
          <AllOffers />
        </section>
      )}
      {user.role === "admin" && activePage === "tous-les-prestataires" && (
        <section className="dash-section">
          <AllProviders />
        </section>
      )}
      {user.role === "admin" && activePage === "tous-les-clients" && (
        <section className="dash-section">
          <AllCustomers />
        </section>
      )}
    </main>
  );
}