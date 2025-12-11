// C:\wamp64\www\aura_test\src\components\HeaderOverlay\HeaderOverlay.jsx
import { Link } from "react-router-dom";
import logoAura from "../../assets/logo_aura_white.png";
import peopleIcon from "../../assets/icons/people.svg";
import MockData from "../../mocks/data.json";
import "../Header/Header.scss"; // pour utiliser les classes déjà définies

export default function HeaderOverlay({
  isOpen,
  closeMenu,
  profileLink,
  navLinks,
  isLoggedIn,
  logout,
}) {
  const categories = MockData.categories_list;

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const overlayClassName = `aura-header__overlay${
    isOpen ? " aura-header__overlay--open" : ""
  }`;

  return (
    <div className={overlayClassName}>
      {/* En-tête overlay : profil, logo, bouton fermer */}
      <div className="aura-header__overlay-header">
        <Link
          to={profileLink}
          className="aura-header__overlay-user"
          onClick={closeMenu}
        >
          <img
            src={peopleIcon}
            alt="Espace utilisateur"
            className="aura-header__overlay-user-icon"
          />
        </Link>

        <div className="aura-header__overlay-logo">
          <Link to="/" onClick={closeMenu}>
            <img src={logoAura} alt="Aura" />
          </Link>
        </div>

        <button
          type="button"
          className="aura-header__overlay-close"
          onClick={closeMenu}
          aria-label="Fermer le menu"
        >
          ×
        </button>
      </div>

      {/* NAV MOBILE */}
      <nav className="aura-header__overlay-nav">
        {/* Accueil */}
        <Link to={navLinks[0].href} onClick={closeMenu}>
          {navLinks[0].label}
        </Link>

        {/* Connexion / Déconnexion */}
        {isLoggedIn ? (
          <button
            type="button"
            className="aura-header__overlay-link-button"
            onClick={handleLogout}
          >
            Déconnexion
          </button>
        ) : (
          <Link to={navLinks[2].href} onClick={closeMenu}>
            {navLinks[2].label}
          </Link>
        )}

        {/* Nos offres */}
        <Link to={navLinks[3].href} onClick={closeMenu}>
          {navLinks[3].label}
        </Link>

        {/* 🟠 ICI : toutes les catégories du dropdown, en clair */}
        {categories.map((cat) => (
          <Link
            key={cat.key}
            to={`/categorie/${cat.key}`}
            onClick={closeMenu}
          >
            {cat.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
