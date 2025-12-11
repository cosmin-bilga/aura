import logoAura from "../../assets/logo_aura.png";
import "./DashboardSidebar.css";

export default function DashSidebar({ user, role }) {
  // Définition des liens selon le rôle
  let navLinks = [];
  if (role === "admin") {
    navLinks = [
      { label: "Toutes les offres", page: "toutes-les-offres" },
      { label: "Tous les prestataires", page: "tous-les-prestataires" },
      { label: "Tous les clients", page: "tous-les-clients" },
    ];
  } else if (role === "provider") {
    navLinks = [
      { label: "Profil", page: "profil" },
      { label: "Mes offres", page: "mes-offres" },
    ];
  } else {
    navLinks = [
      { label: "Profil", page: "profil" },
      { label: "Historique", page: "historique" },
      { label: "Commentaires", page: "commentaires" },
      { label: "Offres favoris", page: "offres-favoris" },
    ];
  }

  return (
    <aside className="dash-sidebar">
      {/* Logo */}
      <a href="/" className="dash-sidebar__logo">
        <img src={logoAura} alt="Aura logo" />
      </a>

      {/* Infos utilisateur */}
      <div className="dash-sidebar__user-info">
        {user.profile_picture && (
          <img
            src={user.profile_picture}
            alt={user.firstname}
            className="dash-sidebar__user-pic"
          />
        )}
        <p className="dash-sidebar__user-name">
          {user.firstname} {user.name}
        </p>
      </div>

      {/* Navigation */}
      <nav className="dash-sidebar__nav">
        {navLinks.map((link) => (
          <a
            key={link.page}
            href={`#${link.page}`} // Pour le moment simple navigation
            className="dash-sidebar__link"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
