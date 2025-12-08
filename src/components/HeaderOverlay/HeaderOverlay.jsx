import { Link } from "react-router-dom";
import ServiceDropdown from "../ServiceDropdown/ServiceDropdown";
import whiteAura from "../../assets/logo_aura_white.png";
import peopleIcon from "../../assets/icons/people.svg";

export default function HeaderOverlay({
  isOpen,
  closeMenu,
  profileLink,
  navLinks,
  isLoggedIn,
  logout,
}) {
  const renderLink = (link) => (
    <Link key={link.label} to={link.href} onClick={closeMenu}>
      {link.label}
    </Link>
  );

  return (
    <div
      className={`aura-header__overlay ${
        isOpen ? "aura-header__overlay--open" : ""
      }`}
    >
      <div className="aura-header__overlay-header">
        <a
          href={profileLink}
          className="aura-header__overlay-user"
          aria-label="Espace utilisateur"
        >
          <img
            src={peopleIcon}
            alt="Profil"
            className="aura-header__overlay-user-icon"
          />
        </a>

        <div className="aura-header__overlay-logo">
          <img src={whiteAura} alt="Aura" />
        </div>

        <button
          type="button"
          className="aura-header__overlay-close"
          onClick={closeMenu}
          aria-label="Fermer le menu"
        >
          ✕
        </button>
      </div>

      <nav className="aura-header__overlay-nav">
        {renderLink(navLinks[0])}
        <ServiceDropdown className="overlay-item" />

        {isLoggedIn ? (
          <>
            <a onClick={logout}>Déconnexion</a>
            {renderLink(navLinks[3])} {/* Nos Offres */}
          </>
        ) : (
          <>
            {renderLink(navLinks[2])} {/* Connexion */}
            {renderLink(navLinks[3])} {/* Nos Offres */}
          </>
        )}
      </nav>
    </div>
  );
}
