import { useEffect, useState } from "react";
import Profile from "./components/Profile";
import History from "./components/History";
import Comments from "./components/Comments";
import FavoriteOffers from "./components/FavoriteOffers";

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

      {activePage === "profil" && <Profile user={user} />}
      {activePage === "historique" && <History user={user} />}
      {activePage === "commentaires" && <Comments user={user} />}
      {activePage === "offres-favoris" && <FavoriteOffers user={user} />}
    </main>
  );
}
