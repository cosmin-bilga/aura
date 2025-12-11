import { useEffect, useState } from "react";
import Profile from "./components/Profile";
import History from "./components/History";
import Comments from "./components/Comments";
import FavoriteOffers from "./components/FavoriteOffers";
import AllOffers from "./AllOffers";
import AllProviders from "./AllProviders";
import AllCustomers from "./AllCustomers";

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
    >
      <h1>Bienvenue, {user.firstname} !</h1>

      {activePage === "profil" && <Profile user={user} />}
      {activePage === "historique" && <History user={user} />}
      {activePage === "commentaires" && <Comments user={user} />}
      {activePage === "offres-favoris" && <FavoriteOffers user={user} />}

      {/* Admin pages */}
      {activePage === "toutes-les-offres" && <AllOffers />}
      {activePage === "tous-les-prestataires" && <AllProviders />}
      {activePage === "tous-les-clients" && <AllCustomers />}
    </main>
  );
}
